# 第 2 章: 第一級関数

## 少し復習

我々が関数が "第一級" と言う時、その関数は単に他と変わりないことを意味しています。言い換えれば普通の階級です。我々は関数を他のデータ型と同じように扱うことが可能で特に何も特別なことはありません - 関数は配列に保存されるかもしれないし、関数の引数として渡されるかもしれないし、変数へ代入されるかもしれません。

このことは JavaScript の基本なのですが言及する価値があります。github でちょっとコードを検索するとこの概念から逃げているか、もしかしたら無視していることが分かるので。例を見てみましょうか？そうしましょう。

```js
const hi = name => `Hi ${name}`;
const greeting = name => hi(name);
```

`greeting` の中に `hi` を関数の中に入れるのは完全に冗長です。なぜか？なぜなら JavaScript では関数は *呼び出し可能* だからです。`hi` はその最後に `()` を持つ場合それは動作し値を返します。そうでない時は単に変数に格納された関数を返します。確認のため見て見ましょう。

```js
hi; // name => `Hi ${name}`
hi("jonas"); // "Hi jonas"
```

`greeting` は全く同じ引数で単に `hi` を呼んでいるだけなので単に以下のように書くこともできます:

```js
const greeting = hi;
greeting("times"); // "Hi times"
```

言い換えると、`hi` はすでに 1 つの引数を取ることが期待される関数なのになぜ別の関数で囲んで同じ引数で単に `hi` を呼ぶのでしょうか？それは全く意味がありません。(It's like donning your heaviest parka in the dead of July just to blast the air and demand an ice lolly.)

不快なほど冗長ですし、関数を他の関数で囲って単にその評価を遅らせるのは悪い習慣です (少し後で何故そうなのか分かりますが、保守と関係します)。

先に行く前にこれをしっかりと理解することが重要です。npm パッケージのライブラリで見つかった面白い例をもういくつか見てみましょう。

```js
// 疎い
const getServerStuff = callback => ajaxCall(json => callback(json));

// 聡明
const getServerStuff = ajaxCall;
```

世の中には正にこのような ajax のコードが沢山あります。以下が両者が同等であることの理由です。

```js
// この行は
ajaxCall(json => callback(json));

// この行と同じ
ajaxCall(callback);

// getServerStuff をリファクタリングすると
const getServerStuff = callback => ajaxCall(callback);

// これと同じになる
const getServerStuff = ajaxCall; // <-- 括弧がない
```

皆さん、これがあるべき姿です。もう 1 回例を見ると私がなぜこれほど固執しているかが分かります。

```js
const BlogController = {
  index(posts) { return Views.index(posts); },
  show(post) { return Views.show(post); },
  create(attrs) { return Db.create(attrs); },
  update(post, attrs) { return Db.update(post, attrs); },
  destroy(post) { return Db.destroy(post); },
};
```

この馬鹿げたコントローラはゴテゴテしていて 99% 冗長です。以下のように書き換えます:

```js
const BlogController = {
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
};
```

もしくはまとめて捨ててしまうことができるでしょう。ビューとデータベースを単に一緒にしている以上のことはしていないので。

## なぜ第一級が好ましいのか

さて第一級関数が好ましい理由を掘り下げてみましょう。`getServerStuff` と `BlogController` の例を見たように、保守や検索をするには冗長なコードの量を単に増やすだけの価値のない中間的な階層を追加するのは容易です。

さらに、もしそのような不必要に内側に追加された関数を変更しなければならない場合、外側の関数も変更しなければなりません。

```js
httpGet('/post/2', json => renderPost(json));
```

もし `httpGet` が `err` を送信するように変更されるとしたら、"接続部分" を変更する必要があります。

```js
// アプリケーション内の全ての httpGet の呼び出しで err を明示的に渡す
httpGet('/post/2', (json, err) => renderPost(json, err));
```
第一級関数として書いていれば変更はもっと少なく済むでしょう。

```js
// 引数の数が幾つであれ renderPost は httpGet 内から呼ばれる
httpGet('/post/2', renderPost);
```

不要な関数を削除する他に、我々は引数の名前を付けたり参照したりしなければなりません。ご存知のように名前はちょっとした問題です - 特にコードベースが古くなって行ったり要求が変更されたりするので。

同じ概念に複数の名前を付けるのはプロジェクトでよく混乱の元になります。汎化的なコードの問題もあります。例えばこれらの 2 つの関数は全く同じことをしますが 1 つは限りなくより汎化的で再利用可能です。

```js
// 我々のブログに特定的
const validArticles = articles =>
  articles.filter(article => article !== null && article !== undefined),

// 将来のプロジェクトにも適用可能
const compact = xs => xs.filter(x => x !== null && x !== undefined);
```

特定的に名前をつけることにより特定のデータ (この場合は `article`) に縛られているように見えます。これはよくあることで多くの再発明の元となります。

ちょうどオブジェクト指向のコードのように、あなたの頸動脈に噛み付いてくる `this` に気づかなければならないことを言及しなければなりません。もし関数が `this` を使い我々が第一級関数として呼び出したとすると、抽象化の漏れの復讐に晒されることになります。

```js
const fs = require('fs');

// 恐ろしい
fs.readFile('freaky_friday.txt', Db.save);

// それほどでもない
fs.readFile('freaky_friday.txt', Db.save.bind(Db));
```

自分自身に範囲を限定すれば、`Db` は典型的なゴミのようなコードにアクセスすることはありません。私は汚れたオムツのような `this` を使うことを避けています。関数的なコードを書くときは本当に全く必要ありません。しかしながら、他のライブラリを使う場合はあなたは周囲の狂気の世界に服従しなければならないかもしれません。

`this` は処理速度の最適化のためには必要だと言う人もいるでしょう。もしあなたが細かい最適化を好む方ならばこの本を閉じてください。もしあなたが自分のお金取り返せないのなら、おそらくそれを何かより手の込んだものと交換することができるかもしれません。

これで先に進む準備ができました。

[第 3 章: 純粋な関数による純粋な幸福](ch03-ja.md)
