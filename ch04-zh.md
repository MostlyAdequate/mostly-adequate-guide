# Chapter 04: Currying

## 不能沒有你

我爸曾經告訴我，有些東西在用之前無足輕重，但獲得之後就戒不掉了。
像是 微波爐，智能手機 就是這樣。
老一輩的在沒有網路的時候也活得很充實。
對我來說，Currying 也是這樣。

它的概念非常簡單：你可以只傳一部份的參數來執行一個函式，
它會回傳一個函式來處理剩下的參數。

你可以決定要一次性的傳全部的參數，或是每次只傳一部份分多次傳。

```js
const add = (x) => (y) => x + y;
const increment = add(1);
const addTen = add(10);

increment(2); // 3
addTen(2); // 12
```

這裡，我們定義了一個函式 `add`，他接受一個參數並返回一個函式。
執行他，會回傳一個新的函式並透過閉包記住第一個參數。
如果要一次性的執行它是有點繁瑣，
好在我們可以使用一個特殊的函式 `curry` 來使這類函式的定義跟調用變得容易些。

讓我們來建立些 curry 函式享受下。
現在，讓我們來調用 `curry` 函式，你可以在 [Appendix A - Essential Function Support](./appendix_a.md) 找到他。

```js
const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));
const filter = curry((f, xs) => xs.filter(f));
const map = curry((f, xs) => xs.map(f));
```

上面的範例遵循了一個簡單，但非常重要的模式。
就是把我們要操作的資料 (String, Array) 策略性的放置在最後一個參數。
到使用他們的時候，你就會明白這樣做的原因了。

(這邊有個語法 `/r/g` 叫做 正則表達式，用來找出所有字母 'r'，
旁邊連結可以了解更多[正則表達式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions))

```js
match(/r/g, "hello world"); // [ 'r' ]

const hasLetterR = match(/r/g); // x => x.match(/r/g)
hasLetterR("hello world"); // [ 'r' ]
hasLetterR("just j and s and t etc"); // null

filter(hasLetterR, ["rock and roll", "smooth jazz"]); // ['rock and roll']

const removeStringsWithoutRs = filter(hasLetterR); // xs => xs.filter(x => x.match(/r/g))
removeStringsWithoutRs(["rock and roll", "smooth jazz", "drum circle"]); // ['rock and roll', 'drum circle']

const noVowels = replace(/[aeiou]/gi); // (r,x) => x.replace(/[aeiou]/ig, r)
const censored = noVowels("*"); // x => x.replace(/[aeiou]/ig, '*')
censored("Chocolate Rain"); // 'Ch*c*l*t* R**n'
```

這邊展示的是一種函式 "預加載" 的能力，
透過照順序傳入其中幾個參數，就能得到一個記住這些參數的新函式。

我強烈建議你 clone 這個 repo (`git clone https://github.com/MostlyAdequate/mostly-adequate-guide.git`),
複製上面的程式碼，然後貼到 REPL 裡面看看。
curry 函式，或是其他會放在附錄的函式都可以在 `support/index.js` 模組中找到。

或是，你可以透過 `npm` 來嘗試看看：

```
npm install @mostly-adequate/support
```

## 不僅僅是咖哩

Currying 用途非常廣泛。
就像前面的 `hasLetterR`，`removeStringsWithoutRs` 和 `censored` 函式，
你可以透過提供參數給基礎函式來產生新的函式。

我們還有能力
透過用 `map` 簡單的將函式包起來，
我們就可以把只作用於一個元素的函式，
轉換成可作用於一整個陣列的函式。

```js
const getChildren = (x) => x.childNodes;
const allTheChildren = map(getChildren);
```

這種傳入部分參數的到函式的作法，我們通常稱為 _局部調用 partial application_，
透過局部調用技巧可以減少很多重複模樣的程式碼。
考慮一下，上面的 `allTheChildren` 函式如果用 lodash 中普通的 `map` 函式來寫會長什麼樣
(注意參數的順序)：

```js
const allTheChildren = (elements) => map(elements, getChildren);
```

通常我們不會特別去定義針對只陣列的函式，
因為我們只需要直接執行 `map(getChildren)` 就好了。
`sort`，`filter` 這些高階函式也是同理。
(_高階函式 higher order function_ 是指一個函式可以接受或返回另一個函式)

還記得我們談論純函式時，
我們提到它是 一個輸入對應到一個結果。
Currying 所做的也正是如此：每個參數會回傳一個新的函式處理剩餘的參數。
這符合了 一個輸入對應到一個結果。

不論輸出是否是另一個函式，他也是純函式。
當然 curry 函式也允許一次傳入多個參數，
但這是出於便於減少額外的 `()`。

## 總結

Curry 函式非常好用，每天使用它是非常享受的一件事。
他就是讓我們在寫函式編程不會那麼煩悶跟繁瑣的必備工具。

透過簡單的傳遞幾個參數，就能動態創建新的函式。
而且還有個額外的好處，
就是儘管函式有多個參數，我們都可以保留函式在數學上的定義。

下一張我們將學習另一個重要的工具，稱作 `compose`

[Chapter 05: 用 compose 的方式寫程式](ch05.md)
