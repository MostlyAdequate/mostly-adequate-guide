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

From mathisfun.com:  

> A function is a special relationship between values:  
> Each of its input values gives back exactly one output value.  

In other words, it's just a relation between two values: the input and the output. Though each input has exactly one output, that output doesn't necessarily have to be unique per input. Below shows a diagram of a perfectly valid function from `x` to `y`;  

<img src="images/function-sets.gif" alt="function sets" />(https://www.mathsisfun.com/sets/function.html)  

To contrast, the following diagram shows a relation that is _not_ a function since the input value `5` points to several outputs:  

<img src="images/relation-not-function.gif" alt="relation not function" />(https://www.mathsisfun.com/sets/function.html)  

Functions can be described as a set of pairs with the position (input, output): `[(1,2), (3,6), (5,10)]` (It appears this function doubles its input).  

Or perhaps a table:

<table> <tr> <th>Input</th> <th>Output</th> </tr> <tr> <td>1</td> <td>2</td> </tr> <tr> <td>2</td> <td>4</td> </tr> <tr> <td>3</td> <td>6</td> </tr> </table>

Or even as a graph with `x` as the input and `y` as the output:

<img src="images/fn_graph.png" width="300" height="300" alt="function graph" />

There's no need for implementation details if the input dictates the output. Since functions are simply mappings of input to output, one could simply jot down object literals and run them with `[]` instead of `()`.

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

Of course, you might want to calculate instead of hand writing things out, but this illustrates a different way to think about functions. (You may be thinking "what about functions with multiple arguments?". Indeed, that presents a bit of an inconvenience when thinking in terms of mathematics. For now, we can bundle them up in an array or just think of the `arguments` object as the input. When we learn about _currying_, we'll see how we can directly model the mathematical definition of a function.)

Here comes the dramatic reveal: Pure functions _are_ mathematical functions and they're what functional programming is all about. Programming with these little angels can provide huge benefits. Let's look at some reasons why we're willing to go to great lengths to preserve purity.

## The Case for Purity

### Cacheable

For starters, pure functions can always be cached by input. This is typically done using a technique called memoization:

```js
const squareNumber = memoize((x) => x * x);

squareNumber(4); // 16

squareNumber(4); // 16, returns cache for input 4

squareNumber(5); // 25

squareNumber(5); // 25, returns cache for input 5
```

Here is a simplified implementation, though there are plenty of more robust versions available.

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

Something to note is that you can transform some impure functions into pure ones by delaying evaluation:

```js
const pureHttpCall = memoize((url, params) => () => $.getJSON(url, params));
```

The interesting thing here is that we don't actually make the http call - we instead return a function that will do so when called. This function is pure because it will always return the same output given the same input: the function that will make the particular http call given the `url` and `params`.

Our `memoize` function works just fine, though it doesn't cache the results of the http call, rather it caches the generated function.

This is not very useful yet, but we'll soon learn some tricks that will make it so. The takeaway is that we can cache every function no matter how destructive they seem.

### Portable / Self-documenting

Pure functions are completely self contained. Everything the function needs is handed to it on a silver platter. Ponder this for a moment... How might this be beneficial? For starters, a function's dependencies are explicit and therefore easier to see and understand - no funny business going on under the hood.

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

The example here demonstrates that the pure function must be honest about its dependencies and, as such, tell us exactly what it's up to. Just from its signature, we know that it will use a `Db`, `Email`, and `attrs` which should be telling to say the least.

We'll learn how to make functions like this pure without merely deferring evaluation, but the point should be clear that the pure form is much more informative than its sneaky impure counterpart which is up to who knows what.

Something else to notice is that we're forced to "inject" dependencies, or pass them in as arguments, which makes our app much more flexible because we've parameterized our database or mail client or what have you (don't worry, we'll see a way to make this less tedious than it sounds). Should we choose to use a different Db we need only to call our function with it. Should we find ourselves writing a new application in which we'd like to reuse this reliable function, we simply give this function whatever `Db` and `Email` we have at the time.

In a JavaScript setting, portability could mean serializing and sending functions over a socket. It could mean running all our app code in web workers. Portability is a powerful trait.

Contrary to "typical" methods and procedures in imperative programming rooted deep in their environment via state, dependencies, and available effects, pure functions can be run anywhere our hearts desire.

When was the last time you copied a method into a new app? One of my favorite quotes comes from Erlang creator, Joe Armstrong: "The problem with object-oriented languages is they’ve got all this implicit environment that they carry around with them. You wanted a banana but what you got was a gorilla holding the banana... and the entire jungle".

### Testable

Next, we come to realize pure functions make testing much easier. We don't have to mock a "real" payment gateway or setup and assert the state of the world after each test. We simply give the function input and assert output.

In fact, we find the functional community pioneering new test tools that can blast our functions with generated input and assert that properties hold on the output. It's beyond the scope of this book, but I strongly encourage you to search for and try _Quickcheck_ - a testing tool that is tailored for a purely functional environment.

### Reasonable

Many believe the biggest win when working with pure functions is _referential transparency_. A spot of code is referentially transparent when it can be substituted for its evaluated value without changing the behavior of the program.

Since pure functions don't have side effects, they can only influence the behavior of a program through their output values. Furthermore, since their output values can reliably be calculated using only their input values, pure functions will always preserve referential transparency. Let's see an example.

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

`decrementHP`, `isSameTeam` and `punch` are all pure and therefore referentially transparent. We can use a technique called _equational reasoning_ wherein one substitutes "equals for equals" to reason about code. It's a bit like manually evaluating the code without taking into account the quirks of programmatic evaluation. Using referential transparency, let's play with this code a bit.

First we'll inline the function `isSameTeam`.

```js
const punch = (a, t) => (a.get("team") === t.get("team") ? t : decrementHP(t));
```

Since our data is immutable, we can simply replace the teams with their actual value

```js
const punch = (a, t) => ("red" === "green" ? t : decrementHP(t));
```

We see that it is false in this case so we can remove the entire if branch

```js
const punch = (a, t) => decrementHP(t);
```

And if we inline `decrementHP`, we see that, in this case, punch becomes a call to decrement the `hp` by 1.

```js
const punch = (a, t) => t.set("hp", t.get("hp") - 1);
```

This ability to reason about code is terrific for refactoring and understanding code in general. In fact, we used this technique to refactor our flock of seagulls program. We used equational reasoning to harness the properties of addition and multiplication. Indeed, we'll be using these techniques throughout the book.

### Parallel Code

Finally, and here's the coup de grâce, we can run any pure function in parallel since it does not need access to shared memory and it cannot, by definition, have a race condition due to some side effect.

This is very much possible in a server side js environment with threads as well as in the browser with web workers though current culture seems to avoid it due to complexity when dealing with impure functions.

## In Summary

We've seen what pure functions are and why we, as functional programmers, believe they are the cat's evening wear. From this point on, we'll strive to write all our functions in a pure way. We'll require some extra tools to help us do so, but in the meantime, we'll try to separate the impure functions from the rest of the pure code.

Writing programs with pure functions is a tad laborious without some extra tools in our belt. We have to juggle data by passing arguments all over the place, we're forbidden to use state, not to mention effects. How does one go about writing these masochistic programs? Let's acquire a new tool called curry.

[Chapter 04: Currying](ch04.md)
