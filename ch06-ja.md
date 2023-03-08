# 第 6 章: アプリケーション例

## 宣言的コーディング

心構えを切り替えます。ここからコンピュータに仕事をどのように行うのか教えるのをやめ、代わりに結果として何をしたいのかの仕様を記述します。その方がいつもすべてのことを細かく管理しようとするよりもストレスが少ないと確信しています。

命令的とは対照的に、宣言的とは式を記述することを意味します。逐次指示を記述するのとは対照的です。

SQL を考えてみてください。"最初にこれをして、それからあれをする" がありません。データベースでやりたいことを指定した式があるだけです。我々は仕事をどのように行うかを決めません。式がそれをします。データベースがアップグレードして SQL のエンジンが最適化された時に我々のクエリを変更する必要はありません。我々の仕様を解釈し同じ結果を達成する方法がたくさんあるからです。

私も含めて最初は宣言的コーディングの概念を把握するのが難しいという方もいらっしゃるでしょう。感覚をつかむためにいくつか例を見てみましょう。

```js
// 命令的
const makes = [];
for (let i = 0; i < cars.length; i += 1) {
  makes.push(cars[i].make);
}

// 宣言的
const makes = cars.map(car => car.make);
```
命令的なループではまず配列を生成しなければなりません。インタプリタはこの文を評価してから進まなければなりません。その後カウンタを手動で増加させながら車のリストを直接たどっていき、明示的な繰り返しの味気ない表示の中で処理を見せています。

`map` バージョンの方は一つの式です。これは評価の順序を要求しません。ここには map 関数がどのように繰り返すのか返される配列がどのように構築されるのかに関して自由があります。*どう* ではなく *何* が指定されています。よって輝かしい宣言的なサッシュを着ています。

より明確でより簡潔であることに加えて、意のままに map 関数が最適化されてもアプリケーションコードは変更される必要がありません。

"はい、でも命令的なループをする方がずっと高速です" と考える方々には、JIT があなたのコードをどのように最適化するのか学習することをお薦めします。こちらは[手がかりを与えてくれる素晴らしいビデオ](https://www.youtube.com/watch?v=g0ek4vV7nEA) です。

別の例です。

```js
// 命令的
const authenticate = (form) => {
  const user = toUser(form);
  return logIn(user);
};

// 宣言的
const authenticate = compose(logIn, toUser);
```

命令的バージョンに必ずしも悪いところはありませんが、まだ逐次評価が組み込まれています。`compose` 式の方は単に事実を述べているだけです: 認証は `toUser` と `logIn` の合成ですと。繰り返しになりますが、ハイレベルでの仕様であるアプリケーションコードでのコード変更の支援と結果の余地は残されています。

上の例では評価の順番は指定されていますが (`toUser` は `logIn` の前に呼ばれなければならない)、順番が重要でないシナリオはたくさんありますし、評価の順番は宣言的なコーディングで容易に指定されます (この後触れます)。

評価の順番をエンコードしなくても良いので、宣言的コーディングは並列コンピューティングに適しています。純粋関数と組み合わせてこれは並列な将来のためになぜ関数型プログラミングが良い選択である理由です - 並列/並行システムを達成するために何か特別なことをしなくてもそれほどしなくても良いのです。

## 関数型プログラミングによる Flickr

ここで宣言的合成的な方法でアプリケーション例を構築してみましょう。まだズルをしてひとまず副作用を使いますが、最小限に抑えて純粋な方のコードベースからは切り離します。flickr の画像を取ってきて表示するブラウザウィジェットを構築します。


```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Flickr App</title>
  </head>
  <body>
    <main id="js-main" class="main"></main>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.2.0/require.min.js"></script>
    <script src="main.js"></script>
  </body>
</html>
```

これが main.js の骨格です。

```js
const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
const jquery = CDN('jquery/3.0.0-rc1/jquery.min');

requirejs.config({ paths: { ramda, jquery } });
requirejs(['jquery', 'ramda'], ($, { compose, curry, map, prop }) => {
  // アプリがここに来る
});
```

lodash や他のユーティリティライブラリの代わりに [ramda](https://ramdajs.com) を引っ張ってきています。それには `compose`, `curry` などが含まれています。requirejs を使っているのはやり過ぎに見えますが、この本を通じてそれを使っていきます。一貫性が鍵です。

さて、ここからはスペックについて見てみましょう。アプリは 4 つのことを行っています。

1. 特定の検索する言葉のための url を構築する
2. flickr API を呼び出す
3. 呼び出し結果の JSON を html 画像に変換する
4. それらをスクリーンに置く

上には 2 つの純粋でない処理があります。分かりますか？それらは flickr API からデータを取得しスクリーンに置くという処理です。まずそれらを定義して隔離してしまいましょう。また、デバッグを容易にするために `trace` 関数を追加します。

```js
const Impure = {
  getJSON: curry((callback, url) => $.getJSON(url, callback)),
  setHtml: curry((sel, html) => $(sel).html(html)),
  trace: curry((tag, x) => { console.log(tag, x); return x; }),
};
```

ここでは jQuery のメソッドをラップしてカリー化し、引数を交換してより好ましい位置にしています。`Impure` という名前空間をつけてそれらが危険な関数であることがわかるようにしています。これから出てくる例でこれら 2 つの関数を純粋なものにするでしょう。

次に url を構築して `Impure.getJSON` 関数に渡さなければなりません。

```js
const host = 'api.flickr.com';
const path = '/services/feeds/photos_public.gne';
const query = t => `?tags=${t}&format=json&jsoncallback=?`;
const url = t => `https://${host}${path}${query(t)}`;
```

モノイド (あとで学習します) やコンビネータを使って `url` をポイントフリーに記述する魅惑的で大袈裟な方法があります。ここでは読みやすいバージョンに固執し普通のポイントあり (pointful) のやり方でこの文字列を構築しています。

There are fancy and overly complex ways of writing `url` pointfree using monoids(we'll learn about these later) or combinators. We've chosen to stick with a readable version and assemble this string in the normal pointful fashion.

Let's write an app function that makes the call and places the contents on the screen.

```js
const app = compose(Impure.getJSON(Impure.trace('response')), url);
app('cats');
```

これは `url` 関数を呼び出し、その文字列を `getJSON` 関数に渡します。それには `trace` が部分的に適用されています。アプリがロードされると API 呼び出しからの応答がコンソールに表示されます。

<img src="images/console_ss.png" alt="console response" />

この JSON から画像を構築したいです。`mediaUrls` が `items` にさらにそれぞれの `media` の `m` 属性が埋め込まれているように見えます。

いずれにしても、これらのネストした属性を取得するために ramda から `prop` と呼ばれる包括的な取得関数を使うことができます。こちらが自家バージョンで何が起きているのかが分かります。

```js
const prop = curry((property, object) => object[property]);
```

実際非常に冴えないです。`[]` 構文を使ってオブジェクトの属性にアクセスしているだけです。`mediaUrls` のためにこれを使ってみましょう。

```js
const mediaUrl = compose(prop('m'), prop('media'));
const mediaUrls = compose(map(mediaUrl), prop('items'));
```

一旦 `items`　を集めたら、url を抽出するためにそれらに `map` を適用しなければなりません。これが `mediaUrls` の配列になります。これをアプリに組み込んで画面に画像を表示させてみましょう。

```js
const render = compose(Impure.setHtml('#js-main'), mediaUrls);
const app = compose(Impure.getJSON(render), url);
```

やったことは `mediaUrls` を呼び出して、`<main>` HTML をそれに設定する合成です。`trace` を `render` に置き換えて生の JSON ではなく何かが描写されるようにしています。これによりページのボディ内に `mediaUrls` がそのまま表示されることになります。

最後のステップはこれらの `mediaUrls` を本物の `images` にすることです。より大規模なアプリケーションでは Handlebars や React のようなテンプレートもしくは DOM ライブラリ使うでしょう。このアプリケーションでは img タグが必要なだけですので jQuery を使うことにしましょう。

```js
const img = src => $('<img />', { src });
```

jQuery の `html` メソッドはタグの配列を受け取ります。mediaUrl を画像に変換して `setHtml` に送れば良いだけです。

```js
const images = compose(map(img), mediaUrls);
const render = compose(Impure.setHtml('#js-main'), images);
const app = compose(Impure.getJSON(render), url);
```

できました！

<img src="images/cats_ss.png" alt="cats grid" />

こちらが最終的なスクリプトです。

[include](./exercises/ch06/main.js)

さて見て下さい。やることがどう行われるかではなく何であるかの美しく宣言的な仕様です。今それぞれの行をいくつかの性質を満たす等式として見ることができます。それらの性質を利用してアプリケーションについて推論したりリファクタリングしたりできます。

## 原理に従ったリファクタリング

ひとつ最適化ができます - map を適用してそれぞれの item を url に変換し、それらの url に再び map を適用して img タグに変換しています。map と合成に関して法則があります。


```js
// map の合成法則
compose(map(f), map(g)) === map(compose(f, g));
```

この性質を使ってコードを最適化できます。原理に従ったリファクタリングをしてみましょう。

```js
// オリジナルのコード
const mediaUrl = compose(prop('m'), prop('media'));
const mediaUrls = compose(map(mediaUrl), prop('items'));
const images = compose(map(img), mediaUrls);
```

map を並べてみましょう。`mediaUrls` への呼び出しを `images` の中へ含めることができます。等価推論と純粋性のおかげで。

```js
const mediaUrl = compose(prop('m'), prop('media'));
const images = compose(map(img), map(mediaUrl), prop('items'));
```

さて `map` を並べて合成法則が適用できるようになりました。

```js
/*
compose(map(f), map(g)) === map(compose(f, g));
compose(map(img), map(mediaUrl)) === map(compose(img, mediaUrl));
*/

const mediaUrl = compose(prop('m'), prop('media'));
const images = compose(map(compose(img, mediaUrl)), prop('items'));
```

今やつは一度だけループを回してそれぞれの item を img に変換するようになりました。関数を抽出してもう少し読みやすくしましょう。

```js
const mediaUrl = compose(prop('m'), prop('media'));
const mediaToImg = compose(img, mediaUrl);
const images = compose(map(mediaToImg), prop('items'));
```

## 要約

新しいスキルを小規模だけども現実世界のアプリにどのように適用するかを見てきました。数学的なフレームワークを使いコードをリファクタリングしました。でも破壊的な関数を単に隔離する代わりにエラー処理やコードの分岐は？アプリケーション全体をどのように純粋にできる？アプリをより安全に表現豊かにすることはできる？これらはパート 2 で取り組む質問になります。

[Chapter 07: Hindley-Milner and Me](ch07.md)
