# Chapter 03: 純粹的函式 純粹的爽

## 喔！讓函式再次純粹

有一件事情我們必須了解就是 純函式的概念。

> 當一個函式，給予同樣的輸入值，永遠會回傳同樣的結果且沒有任何的副作用

> **哈囉註解**
> 以下專有名詞會直接使用英文
>
> - side effect 副作用

比如 `slice` 還有 `splice`，
這兩個函式想達成的目的是一樣的，但用了完全不同的做法。  
我們會說 `slice` 是 _純_ 的，因為我們可以保證拋入同樣的輸入值一定是回傳同樣的結果。  
但是 `splice` 卻是直接將原陣列切掉後再吐回結果，而這個過程永遠的改變了原本的陣列，這就是個可被觀測的 side effect。

```js
const xs = [1, 2, 3, 4, 5];

// pure
xs.slice(0, 3); // [1,2,3]

xs.slice(0, 3); // [1,2,3]

xs.slice(0, 3); // [1,2,3]

// impure
xs.splice(0, 3); // [1,2,3]

xs.splice(0, 3); // [4,5]

xs.splice(0, 3); // []
```

在函式編程中，我們討厭像是 `splice` 這種會改變資料的函式。  
我們追求的是 可靠 且 每次都能回傳相同結果 的函式，  
絕對不會是像 `splice` 那類每次執行都把資料搞得一團糟的類型。

我們來看看另一個例子。

```js
// impure 不純的
let minimum = 21;
const checkAge = (age) => age >= minimum;

// pure 純的
const checkAge = (age) => {
  const minimum = 21;
  return age >= minimum;
};
```

在不純的版本中， `checkAge` 的結果取決於 `minimum` 這個可被異動的變數。  
換句話說，他取決於系統狀態。  
而這一點令人失望，因為它引入了外部的環境從而增加了[認知負荷](https://en.wikipedia.org/wiki/Cognitive_load)。

這個例子可能還不是這麼嚴重，  
但這個依賴關係就是導致系統複雜度的罪魁禍首(http://curtclifton.net/papers/MoseleyMarks06a.pdf)。

`checkAge` 可能會因為輸入值以外的因素導致回傳結果大不相同，  
這不僅僅是不符合純函式的規範，  
更是使我們每次在通靈時弄的我們苦不堪言。  
但是另一邊，純函式的版本，他自己就能達到自給自足。

當然我們也可以將 `minimum` 做成不可變物件，  
這樣做可以保證純粹性，因為他的狀態永遠不會改變。  
為了實現這個，我們必須建立一個物件並將它凍結起來。

```js
const immutableState = Object.freeze({ minimum: 21 });
```

## side effects 可能包括...

為了更清楚的理解，我們在深入討論下 "side effects"。  
所以我們在*純函式*的定義中提到的 萬惡 _side effects_ 到底是什麼？

我們可以理解 "effect 作用" 就是 所有除了計算結果之外，額外發生的其他事。

其實 "effects" 本身並沒有什麼不好，而且在之後的章節隨處可見。  
問題在於 _side_ 這個字，  
水本身並不是滋生蚊蟲的原因，問題是在於他不流動。  
同樣，_side_ effects 中的 _side_ 才是真正滋生 bug 的溫床。

> _side effect_ 是在計算結果的過程中連帶導致系統狀態改變，或是跟外部世界進行可被觀測的互動.

> **哈囉註解**
> 何謂跟外部世界進行可被觀測的互動，請看下面這段

Side effects 可能包括，但不限於：

- 改變檔案系統
- 寫入資料庫
- 做 http 請求
- 異動資料
- 輸出到畫面 / log
- 取得使用者輸入
- 搜尋 DOM 元素
- 訪問系統狀態

這個列表當然可以繼續增加下去。  
任何的對於函式外部的交互都是 side effect，  
關於這點你可能會疑惑毫無 side effect 的程式是有什麼用。

函式編程的哲學就是假定這些 side effects 就是造成不當行為的主因。  
但這並不是說我們要禁用它，  
而是說，我們要掌握他們並要在我們的控制之下。  
在之後的章節，我們將會學到使用 functors 跟 monads 來辦到這些，  
但是現在，先讓我們試著避開這些危險的函式。

Side effects 不符合 _純函式_ 的定義，  
如果一個函式的結果必須仰賴於外部事物，  
那我們就不可能保證它能夠根據相同的輸入，  
對應後返回相同的結果。

在我們接著更深入了解下，為何我們必須堅持 相同的輸入必須返回相同的結果。  
注意！我們要來複習一下你的國中數學了。

## 8th Grade Math

## 8 年級數學

源自 mathisfun.com：

> 函式 是各種數值間的特殊關係：即每一個輸入值皆會返回唯一一個結果值。

換句話說，函式就是 輸入 跟 結果 兩個數值間的關係，
儘管每個輸入都只會有一個結果，但結果並不一定是相同的輸入。
下圖的關係模型展示，一個標準的函式 如何從 `x` 對應至 `y`。

<img src="images/function-sets.gif" alt="function sets" />(https://www.mathsisfun.com/sets/function.html)

與之相對的，下圖的關係圖不是函式的關係模型，
因為 `5` 指向了多個結果：

<img src="images/relation-not-function.gif" alt="relation not function" />(https://www.mathsisfun.com/sets/function.html)

函式可以被描述成一組 兩兩成對 的 集合 ( 輸入 , 結果 )： `[(1,2), (3,6), (5,10)]` (例如旁邊這組看起來是把數值翻倍)

或是 一張表：

<table> <tr> <th>Input</th> <th>Output</th> </tr> <tr> <td>1</td> <td>2</td> </tr> <tr> <td>2</td> <td>4</td> </tr> <tr> <td>3</td> <td>6</td> </tr> </table>

甚至是一張 `x` 作為 輸入， `y` 作為 結果 的 線性圖表：

<img src="images/fn_graph.png" width="300" height="300" alt="function graph" />

如果能將輸入對應到結果，那便沒有必要在意怎麼出來實作，
因為函式就只是將 輸入值 對應成 結果，那其實用物件就能滿足這個需求。

```js
const toLowerCase = {
  A: "a",
  B: "b",
  C: "c",
  D: "d",
  E: "e",
  F: "f",
};
toLowerCase["C"]; // 'c'

const isPrime = {
  1: false,
  2: true,
  3: true,
  4: false,
  5: true,
  6: false,
};
isPrime[3]; // true
```

當然，實際上你不會想一個個自己寫上去，會想用算的，
不過上面的例子是表明了另一種思考韓式的方式。

(你可能會想 “那要是函式有多個參數呢？”
確實這時只用數學的方式思考會有一些不方便。
但現在，我們可以先把多個參數先整個當作一個陣列看待，
或是把 `auguments` 物件當作輸入值。
在之後我們會學到 _currying 柯里化_，
就會知道如何直接為函式套上數學定義的建模。)

非常戲劇化的就是：
純函式指的就是數學的函式，而函式編程基本上就是數學。
透過它能為我們的程式帶來大量的好處，
讓我們來看看為何我們要追求函式的純粹性。

> **哈囉註解**
> 電腦，計算機科學一開始就是數學，
> 包含 圖靈完備 到 Lambda 演算，
> 他的誕生到設計全部皆是。
> 函式編程某種意義上只是將程式設計導回正軌而已。

## “純” 的理由

### 可暫存性

首先，純函式永遠可以根據輸入值來進行暫存。
實現這個的典型手法就叫 memoization：

```js
const squareNumber = memoize((x) => x * x);

squareNumber(4); // 16

squareNumber(4); // 16, returns cache for input 4

squareNumber(5); // 25

squareNumber(5); // 25, returns cache for input 5
```

這邊提供一個簡易的實作版本，儘管它還不夠完備。

```js
const memoize = (f) => {
  const cache = {};

  return (...args) => {
    const argStr = JSON.stringify(args);
    cache[argStr] = cache[argStr] || f(...args);
    return cache[argStr];
  };
};
```

值得一提的是，透過它跟延遲執行的技巧，你可以將原本不純的函式轉變為純函式：

```js
const pureHttpCall = memoize((url, params) => () => $.getJSON(url, params));
```

這裡有趣的地方在於，我們並非實際去執行這個 http 請求 -
取而代之的，我們回傳了一個函式，當調用他的時候才會真正執行。
外面這個函式是純的，因為他永遠會根據相同的輸入，給予相同的結果：
給定 `url` 跟 `params` 之後，他就只會返回一個發送 http 呼叫的函式。

我們的 `memoize` 函式運作一切正常，
雖然他並沒有暫存 http 的結果，
但他暫存了那個生成函式。

現在來看這些還沒什麼實際用處，
但是我們很快就會學到一些技巧來發掘他的用處，
這邊的重點是我們可以暫存任何東西，儘管他看起來多麽有破壞性。

### 可攜性 / 自我文檔化

純函式完全可以自給自足，
所有需要只要單純的丟給他就行了。
在這邊仔細思考一下... 自給自足的好處是什麼。
首先，純函式的依賴關係非常明確，易於觀察跟理解 - 沒什麼黑魔法在背後運作。

```js
// impure
const signUp = (attrs) => {
  const user = saveUser(attrs);
  welcomeUser(user);
};

// pure
const signUp = (Db, Email, attrs) => () => {
  const user = saveUser(Db, attrs);
  welcomeUser(Email, user);
};
```

> **哈囉註解**
> 請記得純函式的定義，在文章的開頭，
> 並不是有依賴外部就不是純函式。

這邊的範例示範了純函式的依賴關係必須透明，
這樣我們就能知道他的目的。
在純函式版的 signUp 中，我們知道他將會用到 `Db`，`Email`，還有 `attrs`，這在最小程度上給予我們足夠的資訊。

後面我們會學到不僅只是將函式延遲來將函式變純。
不過這邊的重點應該很清楚，
純函式的版本相較於不純的函式提供了更多的資訊，
誰知道不純的函式背後到底做了些什麼。

還有值得注意的地方是，我們強制性的“注入”依賴，或是將它們當作參數傳遞，
這讓我們的應用程式明顯個有彈性，因為我們將資料庫或是郵件客戶端或隨便的什麼東西都參數化了，
(別擔心，我們有辦法讓這些看似不這麼單調)。
如果要使用另一個 `Db`，你只需要傳另一個`Db`給他。
如果想在一個新的應用程式使用這個函式，你儘管把 `Db` 跟 `Email` 丟進去就好了，簡單吧。

在 JS ，可攜性意味著你可以把函式序列化並透過 socket 發送。
這更意味著你可以在 web workers 中運行應用程序的程式碼。可攜性是個非常強大的特性。

相對於 命令式編程中 ”典型“ 的方法跟過程都綁定在執行環境下，
並依賴於狀態，依賴關係跟有效作用域。
函式編程與之相反，他與環境無關，只要我有這個意願，我可以在任何地方執行它。

想想把某個方法直接複用到新的應用的機會有多少？
我最喜歡的名言之一就是 Erlang 的作者 Joe Armstrong 的一句話：
“物件導向的問題是，他們永遠都需要攜帶隱含的環境。
你明明只需要一根香蕉，卻得到了一個拿著香蕉的大猩猩... 跟整個叢林”。

### 可測試性

Next, we come to realize pure functions make testing much easier.
We don't have to mock a "real" payment gateway or setup and assert the state of the world after each test.
We simply give the function input and assert output.

接著，純函式更加容易被測試。
我們不需要去偽造一個“真實的”支付系統，或是每次測試之前都要配置，之後都要斷言環境狀態。
我們只需要單純的給予函式輸入並斷言他的結果。

事實上，我們發現函式編程社群正在開創些新的測試工具，
能夠幫助我們自動生成輸入並斷言結果。
這已經超過本書的範圍了，
但我強烈推薦你去試試 _Quickcheck_ - 一個為函式編程量身定做的測試工具。

> **哈囉註解**
> Quickcheck 是 Haskell 的測試工具，非常強大。
> 更延展了一個類別專指這類型的測試，叫 _Property Based Testing_。
> 在 JS 的話，我推薦 fast-check，
> 以後會在專門為大家講解。

### 合理性

大部分人會同意純函式最大的好處就是 _referential transparency 引用透明_。
如果一段程式馬能直接替換成他的執行結果而不會影響整個程式的運作，那我們就會說這段是引用透明的。

因為純函式沒有任何 side effects，
唯一會影響到程式運作的方法就是他的結果。
甚至，因為他們的結果完全是根據輸入值計算來的，
純函式永遠會保證引用透明，我們來看下面的例子。

```js
const { Map } = require("immutable");

// Aliases: p = player, a = attacker, t = target
const jobe = Map({ name: "Jobe", hp: 20, team: "red" });
const michael = Map({ name: "Michael", hp: 20, team: "green" });
const decrementHP = (p) => p.set("hp", p.get("hp") - 1);
const isSameTeam = (p1, p2) => p1.get("team") === p2.get("team");
const punch = (a, t) => (isSameTeam(a, t) ? t : decrementHP(t));

punch(jobe, michael); // Map({name:'Michael', hp:19, team: 'green'})
```

`decrementHP`, `isSameTeam` and `punch` are all pure and therefore referentially transparent.
We can use a technique called _equational reasoning_ wherein one substitutes "equals for equals" to reason about code.
It's a bit like manually evaluating the code without taking into account the quirks of programmatic evaluation.
Using referential transparency, let's play with this code a bit.

`decrementHP`，`isSameTeam` 和 `punch` 都是純函式且皆是引用透明的。
我們可以用一個技巧叫 _equational reasoning 等式推導_ 來分析程式碼。
他有點像不考慮程式實際執行，而是透過人工分析的方式分析程式。
我們來借助一下引用透明來分析一下程式碼。

首先我們先將 `isSameTeam` 裡用到的函式直接寫進去。

```js
const punch = (a, t) => (a.get("team") === t.get("team") ? t : decrementHP(t));
```

因為我們資料是不變的，我們可以簡單的將 teams 換作實際數值。

```js
const punch = (a, t) => ("red" === "green" ? t : decrementHP(t));
```

我們看到它執行結果是 fase，所以我們可以把 `if` 判斷的部分直接去掉。

```js
const punch = (a, t) => decrementHP(t);
```

如果我們也攤平 `decrementHP`，我們就會發現，這個情況下，呼叫 `punch` 等同於讓 `hp` 減 1。

```js
const punch = (a, t) => t.set("hp", t.get("hp") - 1);
```

等式推導對於重構跟理解程式碼是非常重要的。
事實上，我們重構之前的海鷗程式碼就是運用這項技巧，
我們透過等式推導來還原他的真相就只是加法跟乘法。
我們整本書都會用到這個技巧，認真。

> **哈囉註解**
> 實際上，日常跑專案幾乎都會用到等式推導。
> 有些工程師甚至不知道他正在用的技巧就是這個名字。
> 為這些籠統的概念進行抽象化跟專業化，
> 才能把技術正確的傳達到下個世代。

### 平行運算

最後最重要的一點，我們可以對任何純函式做平行運算，
因為他根本不需要共享記憶體，而且根據其定義，
純函式根本就不會遇到 race condition。

JS 在伺服器端的環境跟瀏覽器的 web workers 是非常有機會遇到平行運算的，
不過出於對非純函式的複雜性考量，當前主流觀點似乎避免使用到。

## 總結

我們已經了解純函式到底是什麼跟為什麼我們需要它，
作為一個函式編程工程師，我們深信純函式是與眾不同的。
從這裡開始，我們要致力於用純函式的方式撰寫所有函式。
為此，我們還需要一些工具來幫助我們達到這個目的，
同時也盡量將非純函式區分出來。

如果手頭上沒有一些工具，那純函式撰寫起來就會有點吃力了。
我們將不得不像雜耍似的通過到處傳遞參數來操作資料，而且還被禁止使用狀態，更別提 effect。
沒有人會這樣自虐的，所以接下來我們要來學一個新工具，Curry。

[Chapter 04: Currying](ch04.md)
