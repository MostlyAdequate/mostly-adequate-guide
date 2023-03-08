# 第 5 章: 合成によるコーディング

## 関数の畜産

これが `compose` (合成) です:

```js
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
```

怖くないです！これは _compose_ のレベル9000の超サイヤ人です。推論のために可変個引数の実装を落として 2 つの関数の合成が可能なより単純な形式を考えましょう。一度それを考えれば抽象化をさらに進めて任意の数の関数でもうまくいくと考えられるでしょう (証明することさえ可能です)! 読者にとってはこれがより分かりやすい _compose_ になります。

```js
const compose2 = (f, g) => x => f(g(x));
```

`f` と `g` は関数で `x` はそれらの関数を通じて "送られて"　いる値です。

合成は関数の畜産のように感じます。あなたは関数の飼育者で組み合わせて合成したい 2 つの特性を選んで新しいものを生み出しているのです。使い方は以下の通りです:

```js
const toUpperCase = x => x.toUpperCase();
const exclaim = x => `${x}!`;
const shout = compose(exclaim, toUpperCase);

shout('send in the clowns'); // "SEND IN THE CLOWNS!"
```

2 つの関数の合成は 1 つの新しい関数を返します。これは完璧に意味が通っています: ある型 (この場合は関数) の 2 つの単位が合成されれば、まさにその型 (関数) の 1 つの新しい単位が生み出されるはずです。2 つのレゴを組み合わせて 1 つのリンカーンログを得てはいません。ここには理論があり、我々がいずれ発見する法則があります。

上の `compose` の定義では `f` の前に `g` が走り、右から左へのデータの流れが作り出されます。これは一連の関数呼び出しがネストされているよりもずっと読みやすいです。合成がない場合、上の関数が読まれるのは:

```js
const shout = x => exclaim(toUpperCase(x));
```

内から外への代わりに左から右へ走り、これは左方向へのステップになります(ブー！)。連なりが重要な例を見てみましょう。

```js
const head = x => x[0];
const reverse = reduce((acc, x) => [x, ...acc], []);
const last = compose(head, reverse);

last(['jumpkick', 'roundhouse', 'uppercut']); // 'uppercut'
```

`reverse` はリストを逆にし `head` は最初のアイテムを取り出します。非効率ではありますが、これは実際に動作する `last` 関数です。合成における関数の連なりは明らかなはずです。左から右へ向いたバージョンも定義できなくもないですが、より密接に数学的なバージョンを記述しました。そうです、合成はそのまま数学の本からのものです。実際に合成が満たす特性を見てみましょう。

```js
// 結合性
compose(f, compose(g, h)) === compose(compose(f, g), h);
```

合成は結合的であり、どの 2 つの関数を合成してもかまわないことを意味します。もし文字列を大文字にすることを選んだのなら以下のように書くことができます:

```js
compose(toUpperCase, compose(head, reverse));
// or
compose(compose(toUpperCase, head), reverse);
```

`compose` に対してどのように呼び出しをまとめても構わないため結果は同じになります。これによって以下のように可変引数の合成 (`compose`) を記述し使用することができます。

```js
// 2 つの合成 (compose) を書かなければなりませんでしたが、結合的なので
// 関数を好きなだけ compose に渡しそれらをどのようにまとめるかを compose に任せることができます。
const arg = ['jumpkick', 'roundhouse', 'uppercut'];
const lastUpper = compose(toUpperCase, head, reverse);
const loudLastUpper = compose(exclaim, toUpperCase, head, reverse);

lastUpper(arg); // 'UPPERCUT'
loudLastUpper(arg); // 'UPPERCUT!'
```

結合性を適用することでこの柔軟さと結果が同じであるという心の平安を得ることができます。もう少し複雑な可変引数の定義がこの本の補助ライブラリに含まれており、それは [lodash][lodash-website], [underscore][underscore-website], [ramda][ramda-website] のようなライブラリで普通に見られる定義です。

結合性の喜ばしい利点の 1 つは、関数の任意の一群を抽出しそれら自身を合成としてまとめられることです。前の例をリファクタリングしてみましょう。

```js
const loudLastUpper = compose(exclaim, toUpperCase, head, reverse);

// -- または ---------------------------------------------------------------

const last = compose(head, reverse);
const loudLastUpper = compose(exclaim, toUpperCase, last);

// -- または ---------------------------------------------------------------

const last = compose(head, reverse);
const angry = compose(exclaim, toUpperCase);
const loudLastUpper = compose(angry, last);

// 続く...
```

正答誤答はありません - 好きなようにレゴを当てはめているだけです。通常 `last` や `angry` のように再利用可能なようにまとめるのが最善です。もしファウラーの "[Refactoring][refactoring-book]" を知っているのなら、この過程は "[関数を抽出せよ][extract-function-refactor]" として認識されるかもしれません ... オブジェクトの状態を気にすることなく行われることを除いて。

## ポイントフリー

ポイントフリーとはあなたのデータについて言わなくても良いという意味です。失礼。ポイントフリーとは処理をするデータに言及しない関数を意味します。第一級関数、カリー化、合成を組み合わせてこの方式を生成することができます。

> ヒント: ポイントフリー版の `replace` と `toLowerCase` は [付録 C -
> ポイントフリー・ユーティリティ](./appendix_c-ja.md) に定義されています。見てみてください！

```js
// データ word に言及しているのでポイントフリーではない
const snakeCase = word => word.toLowerCase().replace(/\s+/ig, '_');

// ポイントフリー
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```

`replace` がどのように部分的に適用されているか分かりますか？行われているのは 1 つの引数を持つそれぞれの関数にデータを通すことです。それぞれの関数がそのデータを受け取り処理し受け渡すことがカリー化によって可能になっています。他に気が付くことは、ポイントフリー版では関数を構築するのにデータを必要としないことです。ポイントフリーでない場合は `word` が利用可能になっていなければなりません。

もう 1 つ例を見てみましょう。

```js
// データ name に言及しているのでポイントフリーではない
const initials = name => name.split(' ').map(compose(toUpperCase, head)).join('. ');

// ポイントフリー
// 注意: 'join' の代わりに第 9 章で導入されている付録からの 'intercalate' を使っています！
const initials = compose(intercalate('. '), map(compose(toUpperCase, head)), split(' '));

initials('hunter stockton thompson'); // 'H. S. T'
```

ポイントフリーなコードは不必要な名前を排除し簡潔さ一般化を保つのに役立ちます。ポイントフリーは関数型のコードのためのよいリトマス試験です。それによって入力と出力を取る複数の小さな関数を得たと知ることができるからです。例えば while ループを合成することはできません。しかしながら、注意してください、ポイントフリーは諸刃の剣であり、しばしば意図を曖昧にさせることが可能です。全ての関数型のコードがポイントフリーというわけではなく、それで大丈夫です。ポイントフリーにできる場合と通常の関数にする場合について後で議論します。

## デバッグ

よくある間違いは `map` のような 2 つの引数をとる関数で第一引数を部分適用せずに合成することです。

```js
// 誤 - 最終的には angry に配列を渡し何をするのか知っている人に map を部分適用する。
const latin = compose(map, angry, reverse);

latin(['frog', 'eyes']); // error

// 正 - 各関数が 1 つの引数を期待する。
const latin = compose(map(angry), reverse);

latin(['frog', 'eyes']); // ['EYES!', 'FROG!'])
```

もし合成をデバッグするのが困難な場合は、この関数(純粋ではありませんが)を使って何が起きているかを見ることができます。

```js
const trace = curry((tag, x) => {
  console.log(tag, x);
  return x;
});

const dasherize = compose(
  intercalate('-'),
  toLower,
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire');
// TypeError: Cannot read property 'apply' of undefined
```

何かが違います。`trace` してみましょう。

```js
const dasherize = compose(
  intercalate('-'),
  toLower,
  trace('after split'),
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire');
// split の後 [ 'The', 'world', 'is', 'a', 'vampire' ]
// after split [ 'The', 'world', 'is', 'a', 'vampire' ]
```

あ！配列を処理しているので `toLower` に `map` が必要です。

```js
const dasherize = compose(
  intercalate('-'),
  map(toLower),
  split(' '),
  replace(/\s{2,}/ig, ' '),
);

dasherize('The world is a vampire'); // 'the-world-is-a-vampire'
```

デバッグのために `trace` 関数を使ってある時点のデータを見ることが可能です。Haskell や PureScript に同じような関数があり開発をしやすくしています。

合成はプログラムを構築するためのツールであり、運よく、うまくいくことを保証する強力な理論により支えられています。この理論を見てみましょう。


## 圏論

圏論は数学の抽象的な領域で、集合論、型理論、群論、論理などの複数の異なる領域からの概念を形式立てることができます。圏論は主にオブジェクト、射、変換を扱い、プログラミングを非常に密接に映し出しています。以下はそれぞれの理論から見た同じ概念の表になります。

<img src="images/cat_theory.png" alt="category theory" />

すみません、怖がらせるつもりはありませんでした。これらすべての概念を直ちに理解することを期待していません。お伝えしたかったのは、重複がどれぐらいあるのかなぜ圏論がそれらを統一しようとしているのかということです。

圏論では圏と呼ばれるものを持ちます。圏は以下の要素の集合として定義されています。

  * オブジェクトの集合
  * 射の集合
  * 射の合成の概念
  * 恒等射と呼ばれる射

圏論は抽象的で様々なものをモデル化できますが、型と関数に適用してみましょう。ひとまずそれが関心のあることです。

**オブジェクトの集合**
オブジェクトはデータ型です。例えば ``String``, ``Boolean``, ``Number``, ``Object`` などです。データ型はすべての可能な値の集合として見られます。``Boolean``　を `[true, false]` の集合、``Number``　をすべての可能な数値の集合として見ることができます。集合論を使うことができるので型を集合として扱うと便利です。

**射の集合**
射は標準的な日常的に使う純粋関数です。

**射の合成の概念**
お察しの通り、これは新しいおもちゃ `compose` です。議論したように、`compose` が結合的であるのは偶然ではなく、圏論での合成が満たさねければならない性質です。

以下が合成を示す図です。

<img src="images/cat_comp1.png" alt="category composition 1" />
<img src="images/cat_comp2.png" alt="category composition 2" />

以下がコードによる具体例です。

```js
const g = x => x.length;
const f = x => x === 4;
const isFourLetterWord = compose(f, g);
```

**恒等射と呼ばれる射**
`id` と呼ばれる便利な関数を導入しましょう。この関数は単に何か入力を受け取りそれを返すだけです。見てください。

```js
const id = x => x;
```

"一体これの何が便利なのか？" と自問するかも知れません。次章からこれを頻繁に使いますが、とりあえず値の代わりになる関数 - データとして仮装した関数 - と考えてください。

`id` は合成と協調しなければなりません。以下はすべての 1 変数関数 f が満たす性質です。

```js
//　恒等
compose(id, f) === compose(f, id) === f;
// true
```

ほら、まるで数の恒等性みたいではないですか！直ちには明らかではありませんが、少し時間をかけてみてください。その無駄遣いさを理解してください。後で `id` が至る所で使われるのを見ることになりますが、ひとまずそれは与えられた値の代わりになると考えてください。ポイントフリーのコードを書くときに非常に便利です。

そう、型と関数の圏です。もしこれがあなたにとって初めて導入されるものならば圏が何でありなぜ便利なのかまだ少し不確かであると想像します。この本を通してこの知識の上に積み重ねていきます。現時点、この章、この文章においては、少なくとも合成に関する知恵を我々に提供していると見ることができます - すなわち、結合性と恒等性です。

他に圏はありますか、と質問しますか？そうですね、ノードがオブジェクト、エッジが射、パスの結合が合成になる有向グラフを定義することができます。数をオブジェクト、`>=` を射として定義することができます (実際、半および全順序が圏です)。圏のヒープがありますが、この本の目的のために上で定義したもののみを扱うことにします。表層は十分に目を通しました。進むことにします。

## 要約

合成は関数を一連のパイプのように繋げます。データはアプリケーションを通じて流れます - 言わば純粋関数は出力への入力であり、そのためこの繋がりを壊すことは出力を無視することになりソフトウェアを使い物にならなくしてしまうでしょう。

上のすべてのものの設計指針として合成が使われます。これによってアプリケーションが簡潔で推量しやすくなるからです。圏論はアプリケーションのアーキテクチャ、副作用のモデリング、正しさの確証において大きな役割を担うことになります。

今実際にこのいくつかのものを見てみようというところまで来ました。例となるアプリケーションを作ってみましょう。

[第 5 章: アプリケーション例](ch06-ja.md)

## 演習問題

以下のそれぞれの演習で以下の形の車オブジェクトを考えます。

```js
{
  name: 'Aston Martin One-77',
  horsepower: 750,
  dollar_value: 1850000,
  in_stock: true,
}
```


{% exercise %}
`compose()` を使って以下の関数を書き直してください。

{% initial src="./exercises/ch05/exercise_a.js#L12;" %}
```js
const isLastInStock = (cars) => {
  const lastCar = last(cars);
  return prop('in_stock', lastCar);
};
```

{% solution src="./exercises/ch05/solution_a.js" %}
{% validation src="./exercises/ch05/validation_a.js" %}
{% context src="./exercises/support.js" %}
{% endexercise %}


---

以下の関数を考える時

```js
const average = xs => reduce(add, 0, xs) / xs.length;
```

{% exercise %}

ヘルパー関数 `average` を使って `averageDollarValue` を合成にしてください。

{% initial src="./exercises/ch05/exercise_b.js#L7;" %}
```js
const averageDollarValue = (cars) => {
  const dollarValues = map(c => c.dollar_value, cars);
  return average(dollarValues);
};
```

{% solution src="./exercises/ch05/solution_b.js" %}
{% validation src="./exercises/ch05/validation_b.js" %}
{% context src="./exercises/support.js" %}
{% endexercise %}


---


{% exercise %}
`compose()` とポイントフリーの他の関数を使って `fastestCar` をリファクタリングしてください。ヒント、`append` 関数が役に立つでしょう。

{% initial src="./exercises/ch05/exercise_c.js#L4;" %}
```js
const fastestCar = (cars) => {
  const sorted = sortBy(car => car.horsepower);
  const fastest = last(sorted);
  return concat(fastest.name, ' is the fastest');
};
```

{% solution src="./exercises/ch05/solution_c.js" %}
{% validation src="./exercises/ch05/validation_c.js" %}
{% context src="./exercises/support.js" %}
{% endexercise %}

[lodash-website]: https://lodash.com/
[underscore-website]: https://underscorejs.org/
[ramda-website]: https://ramdajs.com/
[refactoring-book]: https://martinfowler.com/books/refactoring.html
[extract-function-refactor]: https://refactoring.com/catalog/extractFunction.html
