# Chapter 02: 一級函式

> **免責聲明**  
> 這是篇翻譯文，關於文章中有些嗆的意見，  
> 請找 Franklin Frisby 教授，請不要找我。

## 快速閱覽

當我們說 函式是 "一等公民" 時，  
其實就是指 函式 跟其他的物件一樣沒什麼特別的。  
他可以儲存在陣列裏，當成參數傳遞，賦值給變數，你想怎樣都行。

這是 JS 的基本觀念，但值得一提的是 
在 Github 上隨便搜一下就可以感受到大部分人對這個概念的無視，或者是根本就不知道。  
讓我們來先舉個虛構的範例：

```js
const hi = (name) => `Hi ${name}`;
const greeting = (name) => hi(name);
```

這裏將 `hi` 包進 `greeting` 函式 完全是多餘的。  
為什麼呢？因為在 JS 裏，函式 是 _callable_ (可以被呼叫的)。

當 `hi` 後面加上 `()` 時，他就會執行並且回傳一個數值。  
如果沒有 `()`，就是單純的將那個函式當成一個變數而已。

讓我們來看看：

```js
hi; // name => `Hi ${name}`
hi("jonas"); // "Hi jonas"
```

因為 `greeting` 不過就是把參數丟去 call `hi` 函式而已，  
所以我們可以寫簡單點：

```js
const greeting = hi;
greeting("times"); // "Hi times"
```

換句話說，`hi` 已經是個函式且可以接受一個參數，  
為什麼需要另外定一個函式然後只是單純把同樣的參數丟去呼叫 `hi`？  
完全沒道理啊。  
這就像你在夏天的時候穿羽絨大衣，然後為了避免中暑跑去吃冰棒。

用一個函式把另一個函式包起來，目的僅是為了延遲執行它，這是一個很糟糕的習慣。  
(稍後我們會討論原因，這跟維護性密切相關)

充分的理解這個問題對於讀懂後續的章節至關重要，  
所以我們再來驗證更有趣的例子，以下的範例都源自 npm 上的函式庫：

```js
// ignorant
const getServerStuff = (callback) => ajaxCall((json) => callback(json));

// enlightened
const getServerStuff = ajaxCall;
```

這世上多得是這種 ajax 垃圾扣。以下解釋為什麼上面兩種寫法等價：

```js
// this line
ajaxCall((json) => callback(json));

// is the same as this line
ajaxCall(callback);

// so refactor getServerStuff
const getServerStuff = (callback) => ajaxCall(callback);

// ...which is equivalent to this
const getServerStuff = ajaxCall; // <-- look mum, no ()'s
```

各位，以上才是函式的正確用法。一會兒告訴你為何我對此如此執著。

```js
const BlogController = {
  index(posts) {
    return Views.index(posts);
  },
  show(post) {
    return Views.show(post);
  },
  create(attrs) {
    return Db.create(attrs);
  },
  update(post, attrs) {
    return Db.update(post, attrs);
  },
  destroy(post) {
    return Db.destroy(post);
  },
};
```

這個可笑的 controller 99% 都是垃圾。我們直接重寫：

```js
const BlogController = {
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
};
```

... 或是乾脆把它整個刪掉，  
因為它的用途就只是把 `Views` 跟 `Db` 包在一起而已。

## 為何鍾愛一等函式？

好了，現在讓我們來看看為何鍾愛一級函式。  
就像我們先前看到的 `getServerStuff` 還有 `BlogController` 範例，  
增加的間接層，除了徒增程式碼的量跟增加維護跟檢索的成本之外根本沒什麼用。

此外，如果一個函式，被人莫名其妙的包進另一個函式中，  
表示每次要修改，就要連同包裹的函式也要一起調整。

```js
httpGet("/post/2", (json) => renderPost(json));
```

如果 `httpGet` 要修改成可以拋 `err`，  
那變成我們必需回頭把所有有用到 `httpGet` 一個個找出來改。

```js
// 把整個應用程式的所有 httpGet 找出來調整成可以拋 err
httpGet("/post/2", (json, err) => renderPost(json, err));
```

但當我們寫成一級函式時，我們需要做的異動少的多了：  

```js
// renderPost 將會在 httpGet 中被調用，想要多少參數都行
httpGet("/post/2", renderPost);
```

除了刪除非必要的函式，為參數命名也是重要。  
當然命名不是很大的問題，但還是可能存在一些不當的命名 -  
尤其是隨著程式的年代增加，跟需求改變的時候。

在專案進行中，很常見的令人困惑的舉措就是，  
為同一個概念使用不同的命名，且這還有代碼通用性的問題。  
舉例來說，這邊兩個函式做的事情一模一樣，  
但後者明顯更加通用，且重用性更高。

```js
// specific to our current blog
const validArticles = articles =>
  articles.filter(article => article !== null && article !== undefined),

// vastly more relevant for future projects
const compact = xs => xs.filter(x => x !== null && x !== undefined);
```

在命名時，我們很容易就會將自己限定在特定的資料數據上 (本例中是 `articles`)。  
這種現象非常常見，也是重複造輪子的一大原因。

有一點我必須提醒一下，你必須非常小心不要被 `this` 給雷了一頓，
這一點跟物件導向類似。  
如果我們是透過一級函式的用法去執行一個底層有用到 `this` 的函式，
那你就等著被它氣死吧。

```js
const fs = require("fs");

// scary 悲劇了
fs.readFile("freaky_friday.txt", Db.save);

// less so 好一點
fs.readFile("freaky_friday.txt", Db.save.bind(Db));
```

將 `Db` 的 `this` 綁在 `Db` 自己身上之後，就可以自由的調用他的原型鏈垃圾扣了。  
我竭盡可能的避免用到 `this`，就像不要碰到髒東西，  
因為在函式編程中根本用不到 `this`。  
然而，在跟其他函式庫對接時，你還是不得不跟這個瘋狂的世界低頭。  

也有人反駁說 `this` 可以提昇執行速度。  
如果你是對這種超微小優化有興趣的人，你還是別看了吧。  
如果你沒法退貨，或許你可以考慮換本偏入門的來念。

至此，我們準備好繼續往前了。

[Chapter 03: 純粹的函式 純粹的爽](ch03.md)
