# Chapter 01: 我們在做什麼？

## 介紹

哩厚！我是 Franklin Frisby 教授。很榮幸認識妳。  
接下來我們會共度一段時光，  
因為我要教你一些函式編程囉！  

關於我的部分，我就介紹到這邊，來談談你怎麼樣？  
我希望你至少有一些熟悉 JavaScript 程式語言，  
也有一點點 物件導向 的經驗，  
而且覺得自己算是合格的工程師了。  
你不需要拿個昆蟲學博士也能抓出 Bug 並宰了他。  

我不會預設你之前有任何 函式編程 相關的知識，  
畢竟我們都知道預設立場的結果(就是讓你我都難堪)。  

但我猜你應該有經歷過一些不太好的狀況，  
像是 mutable state (可變動狀態)，unrestricted side effects (無節制的副作用)，還有 unprincipled design (毫無理由的設計)。  

介紹到此，讓我們開始吧。  
本章節的目標是讓你對 函式編程 有個初步的了解。  

為了能夠了解接下來的章節，我們要知道怎麼樣的寫法才算是 函式編程。  
不然我們會發現自己在胡搞瞎搞，不分青紅皂白的排斥使用物件 - 鬼打牆。  
我們的代碼需要明確的準則，就像浪潮之中需要羅盤指引。  

現在，已經有些通用的編程原則 -  
各種縮寫詞會帶領我們走過任何軟體開發的逆境：  

> DRY (don't repeat yourself),  
> 不要跳針  

> YAGNI (ya ain't gonna need it),  
> 你不會用到  

> loose coupling high cohesion,  
> 高內聚低耦合

> the principle of least surprise,  
> 意外最小化

> single responsibility,  
> 單一原則

之類的。

我當然不會囉哩八唆的把我這些年聽到的原則全部列出來
這邊的重點在於他同樣適用於 函式編程，
雖然跟我們接下來要討論的沒太大關係。

在我們深入探討之前，我想先透過這個章節給你一種感覺，  
讓你在敲鍵盤的時候能體會到函式極樂世界。  

<!--BREAK-->

## 舉個例子

我們從一個很蠢的例子開始。下面是海鷗應用程式。  
當鳥群合併變成更大的鳥群，然後他們會繁殖，增加的數量就是繁殖出的海鷗數量。  
注意，以下不是好的物件導向程式碼，他只是拿來強調這種變量賦值的弊端。

```js
class Flock {
  constructor(n) {
    this.seagulls = n;
  }

  conjoin(other) {
    this.seagulls += other.seagulls;
    return this;
  }

  breed(other) {
    this.seagulls = this.seagulls * other.seagulls;
    return this;
  }
}

const flockA = new Flock(4);
const flockB = new Flock(2);
const flockC = new Flock(0);
const result = flockA
  .conjoin(flockC)
  .breed(flockB)
  .conjoin(flockA.breed(flockB)).seagulls;
// 32
```

應該沒人會寫出這種鬼東西吧？  
他讓內部可變狀態變得非常難以追蹤，  
然後，更棒的，答案還是錯的！  
他應該要是 `16`，但因為 `flockA` 在運算過程中被改變了。  
可憐的 `flockA`。這完全歸功於 I.T 野蠻的計算方式！

如果你看嘸這段程式，沒關係拉，我也看嘸。  
重點是狀態跟數值異動在這邊非常難追蹤，就算是這麼小的範例。  

讓我們再試一次，這次來換成稍微接近 函式編程 的做法：

```js
const conjoin = (flockX, flockY) => flockX + flockY;
const breed = (flockX, flockY) => flockX * flockY;

const flockA = 4;
const flockB = 2;
const flockC = 0;
const result = conjoin(
  breed(flockB, conjoin(flockA, flockC)),
  breed(flockA, flockB)
);
// 16
```

好喔，這次我們有正確答案了，還少寫了很多程式碼。  
雖然函式包來包去有點讓人費解... ( 我們會在第五章解決這個問題 )。  

但好多了，讓我們再更深入鑽研一些，  
這裏有些寶物值得我們挖掘。  

當我們把這段程式碼分析透徹之後，  
會發現，他不過就是在做簡單的 加法 (`conjoin`) 跟 乘法 (`breed`)。  

他根本除了名字之外就沒啥難懂的地方了。  
我們來重新命名一下，看看他的真相。  

```js
const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

const flockA = 4;
const flockB = 2;
const flockC = 0;
const result = add(
  multiply(flockB, add(flockA, flockC)),
  multiply(flockA, flockB)
);
// 16
```

這樣一來，你就發現這不就是：

```js
// 結合律 associative
add(add(x, y), z) === add(x, add(y, z));

// 交換律 commutative
add(x, y) === add(y, x);

// 同一律 identity
add(x, 0) === x;

// 分配律 distributive
multiply(x, add(y, z)) === add(multiply(x, y), multiply(x, z));
```

喔！是的，這些經典數學定律遲早會遇到。  
先不用擔心如果你對這個毫無印象，  
對大多數人來說，這早就還給老師不知道幾年了。  
讓我們再看看能否運用這些定律來簡化我們的小程式。  

```js
// Original line
add(multiply(flockB, add(flockA, flockC)), multiply(flockA, flockB));

// Apply the identity property to remove the extra add
// (add(flockA, flockC) == flockA)
add(multiply(flockB, flockA), multiply(flockA, flockB));

// Apply distributive property to achieve our result
multiply(flockB, add(flockA, flockA));
```

水拉！除了調用函式，一點多餘的程式都不用寫。  
當然我們在這定義 `add` 跟 `multiply` 是為了程式的完整性，  
但其實根本就不需要，  
我們可以保證，`add` 跟 `multiply` 肯定早就存在某個 Library 之中了。

你可能在想 “你也太偷換概念了吧！居然舉了個數學的例子”。  
或是 “真實世界的程式比這個複雜多了，不能這麼簡單做結論”。  

我之所以會選這個例子，是因為絕大多數的人都已經知道怎麼做加法跟乘法，     
所以很容易就能理解數學可以如何被我們運用。   

不用絕望 -
透過這本書，我們還會討論到 
- 範疇論 (category theory)， 
- 集合論 (set theory)， 
- lambda 演算 (lambda calculus)  

還有一些真實世界的範例，   
而且其簡潔度跟準確度一點也不輸這個海鷗程式碼。   

你不需要成為一個數學家，  
他將會非常自然且簡單，就像你在使用一般的框架跟函式庫。   

你聽到也許會覺得驚訝，但我們確實是遵循著函式編程的方式，撰寫完整的，日常的應用程序。  
有著優異性能，且簡潔容易推導的應用程序。  
且不用每次都重造輪子。  

如果你是職業罪犯那違法可能是件好事，但在本書，我們希望遵守數學的法律。  

我們希望能夠完美的接合我們用到的所有理論，  
希望能透過某種 通用 且 可組合 的元件 來表示我們的特定問題，  
然後利用這些特性來解決我們的問題。  
他將會變得比起 命令式編程那種 “只能跑” 的程式碼來的更有紀律。      
(我們之後會介紹命令式的精確定義，這邊先暫時想成除了函式編程之外的其他方式).   
函式編程會帶給你更多的約束，但你會驚訝於這種強制約束，數學性的 “框架” 所帶來的回報。  

我們已經看到了函式編程的北極星了，  
但在真正開始我們的旅程之前，我們要先掌握具體的基本觀念。

[Chapter 02: 一級函式](ch02.md)