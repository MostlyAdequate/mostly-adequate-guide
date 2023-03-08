# 第 4 章: カリー化

## あなたなしには生きられない

かつて私の父は、手に入れる前はどのように生活できるのか、というものがいくつかあると説きました。電子レンジはそのようなものですし、スマートフォンもそうです。年配の方はインターネットなしの充実した生活を思い出すでしょう。私にとってはカリー化がそのリストに載ります。

コンセプトは単純です: 期待されているよりも少ない数の引数で関数を呼ぶことができます。関数は残りの引数を取る関数を返します。

一度に呼び出すこともできますし、単にそれぞれの引数を少しずつ渡していくこともできます。

```js
const add = x => y => x + y;
const increment = add(1);
const addTen = add(10);

increment(2); // 3
addTen(2); // 12
```

ここでは 1 つの引数を取る関数を返す関数 `add` を作成しています。この関数を呼び出すことにより、返された関数はクロージャを通じて第 1 引数を覚えています。両方の引数を付けてこの関数を呼び出すのは少し苦痛ですが、`curry` と呼ばれる特別なヘルパー関数を使ってこのような関数を定義し呼び出すのをより簡単にすることができます。

カリー化された関数をいくつか設定してみましょう。以降は [付録 A - 必須関数のサポート](./appendix_a-ja.md) で定義された `curry` を呼び出します。

```js
const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));
const filter = curry((f, xs) => xs.filter(f));
const map = curry((f, xs) => xs.map(f));
```

私が従ったパターンは単純ですが重要なものです。意図的に、処理されるデータ (文字列、配列) が最後の引数になるようにしています。なぜそのように使用されているのか後で明らかになるでしょう。

(文法 `/r/g` は正規表現で _全ての文字 'r' に合致_ を意味します。よろしければ [正規表現](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Regular_Expressions) を読んでみてください。)

```js
match(/r/g, 'hello world'); // [ 'r' ]

const hasLetterR = match(/r/g); // x => x.match(/r/g)
hasLetterR('hello world'); // [ 'r' ]
hasLetterR('just j and s and t etc'); // null

filter(hasLetterR, ['rock and roll', 'smooth jazz']); // ['rock and roll']

const removeStringsWithoutRs = filter(hasLetterR); // xs => xs.filter(x => x.match(/r/g))
removeStringsWithoutRs(['rock and roll', 'smooth jazz', 'drum circle']); // ['rock and roll', 'drum circle']

const noVowels = replace(/[aeiou]/ig); // (r,x) => x.replace(/[aeiou]/ig, r)
const censored = noVowels('*'); // x => x.replace(/[aeiou]/ig, '*')
censored('Chocolate Rain'); // 'Ch*c*l*t* R**n'
```

ここで実演されているのは 1 つまたは 2 つの引数とともに関数を "先読み" し、それらの引数を覚えている新しい関数を受け取ることができるということです。

Mostly Adequate のリポジトリ (`git clone https://github.com/MostlyAdequate/mostly-adequate-guide.git`) をクローンし上のコードをコピーして REPL で試すことを推奨します。付録に実際に定義されているものと同様、カリー関数は `support/inde.js` モジュールから使うことができます。

もしくは `npm` で公開されているものを見てみてください。

```
npm install @mostly-adequate/support
```

## 言葉遊び以上に / 特別なソース

カリー化は多くのものに有用です。`hasLetterR`, `removeStringsWithoutRs`, `censored` に見られるように、元の関数にいくつか引数を渡すだけで新しい関数を作成することができます。

また単に `map` で囲うことにより、単一の要素を処理する関数を配列を処理する関数に変換することもできます。

```js
const getChildren = x => x.childNodes;
const allTheChildren = map(getChildren);
```

期待されているより少ない数の引数を関数に与えることを通常 *部分適用* と呼びます。部分適用により、多くの定型のコードを取り除くことができます。lodash のカリー化されていない `map` によって上の `allTheChildren` がどのようになるか考えてみてください (引数の順序が異なることに注意):

```js
const allTheChildren = elements => map(elements, getChildren);
```

通常 `map(getChildren)` をインラインで呼び出せるので、配列を処理する関数を定義しません。`sort`, `filter` や他の高階関数も同じです (*高階関数* は関数を引数に取るもしくは返す関数)。

*純粋関数* について話した時、それは 1 つの入力に対し 1 つの出力を取ると言いました。カリー化はまさにそれです: それぞれの単一の引数が残りの引数を期待する新しい関数を返します。オールドスポート、これは 1 入力 1 出力です。

出力が関数であってもそれは純粋と見なされます。一度に 1 より多い引数を許容しますが、これは便宜上余分な `()` を取り除いているだけのように見えます。

## 要約

カリー化は便利で、私はカリー化された関数を日常的に使っています。それは関数型プログラミングをより簡潔により面白くする道具です。

単にいくつかの引数を渡すことにより、その場で新しい便利な関数を作成することができます。それに加え複数の変数にもかかわらず数学的な関数の定義を保持しています。

もう一つの道具 `compose` を手に入れましょう。

[第 5 章: 合成によるコーディング](ch05-ja.md)

## 演習問題

#### 演習問題に関する注意

この本を通じ以下のような '演習問題' に出会うかもしれません。もし [gitbook](https://mostly-adequate.gitbooks.io/mostly-adequate-guide) から読んでいれば (推奨)、演習問題はブラウザ内で直接行うことができます。

この本の全ての演習問題では常に沢山のヘルパー関数をグローバルスコープで使用できることに注意してください。つまり [Appendix A](./appendix_a-ja.md),[Appendix B](./appendix_b.md) and [Appendix C](./appendix_c.md) で定義されているものを使用することができます! これで十分でなかった場合はいくつかの演習問題では問題に特化された関数も定義されています; 実際そうした関数も利用可能だと考えてください。

> ヒント: 組み込みのエディターで `Ctrl + Enter` すると解答を提出することができます!

#### あなたの PC で演習問題を実行する (任意)

好みのエディターを使用して直接ファイルで演習問題を行いたい場合:

- リポジトリをクローン (`git clone git@github.com:MostlyAdequate/mostly-adequate-guide.git`)
- *演習問題* セクションに移動 (`cd mostly-adequate-guide/exercises`)
- 必要なものを [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) でインストール (`npm install`)
- 対応する章の *exercise\_\** ファイルを編集して解答を完成
- npm で答え合わせを実行  (例: `npm run ch04`)

解答に対してユニットテストが走り、もし間違っている場合はヒントが提供されます。ちなみに、演習問題の解答は *solution\_\** ファイルにあります。

#### 練習しましょう!

{% exercise %}
関数の部分適用により全ての引数を取り除くようにリファクタリングしてください。

{% initial src="./exercises/ch04/exercise_a.js#L3;" %}
```js
const words = str => split(' ', str);
```

{% solution src="./exercises/ch04/solution_a.js" %}
{% validation src="./exercises/ch04/validation_a.js" %}
{% context src="./exercises/support.js" %}
{% endexercise %}


---


{% exercise %}
関数の部分適用により全ての引数を取り除くようにリファクタリングしてください。

{% initial src="./exercises/ch04/exercise_b.js#L3;" %}
```js
const filterQs = xs => filter(x => match(/q/i, x), xs);
```

{% solution src="./exercises/ch04/solution_b.js" %}
{% validation src="./exercises/ch04/validation_b.js" %}
{% context src="./exercises/support.js" %}
{% endexercise %}


---

以下の関数について:

```js
const keepHighest = (x, y) => (x >= y ? x : y);
```

{% exercise %}
`keepHighest` を利用して `max` が引数を参照しないようにリファクタリングしてください。

{% initial src="./exercises/ch04/exercise_c.js#L7;" %}
```js
const max = xs => reduce((acc, x) => (x >= acc ? x : acc), -Infinity, xs);
```

{% solution src="./exercises/ch04/solution_c.js" %}
{% validation src="./exercises/ch04/validation_c.js" %}
{% context src="./exercises/support.js" %}
{% endexercise %}
