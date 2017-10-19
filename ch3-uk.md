# Частина 3: Справжнє щастя з чистими функціями

## О, знову бути чистими

Одина річ яка нам потрібна, це ідея чистоти функції.

>Чиста функція, це така функція, котра, при однакових вхідних данних, завжди повертатиме однаковий результат і не має жодних видимих побічних ефектів.

Візьмемо, наприклад, `slice` та `splice`. Це дві функції, які роблять точнісінько одну й ту саму річ, нехай і у абсолютно різний спосіб, подумали ви, але все ж таки одну й ту саму річ. Ми кажемо `slice` є *чистою*, бо вона кожен раз гарантовано повертає одноковий результат. `splice`, натомість, пережує отриманий масив та виплюне назавжди змінений, що є нічим іншим як видимим побічним ефектом. 

```js
var xs = [1, 2, 3, 4, 5];

// чисто:
xs.slice(0, 3);
//=> [1, 2, 3]

xs.slice(0, 3);
//=> [1, 2, 3]

xs.slice(0, 3);
//=> [1, 2, 3]


// не чисто:
xs.splice(0, 3);
//=> [1, 2, 3]

xs.splice(0, 3);
//=> [4, 5]

xs.splice(0, 3);
//=> []
```

У функціональному програмуванні ми зневажаємо, так би мовити, функція як от `splice`, які *мутують(змінюють)* данні. Нам таке не підходить, оскільки ми прагнемо покладатись на надійні функції, котрі завжди повертають один й той самий результат, а не лишають за собою безлад, як це робить метод `splice`.

Давайте розглянемо інший приклад.

```js
// не чисто:
var minimum = 21;

var checkAge = function(age) {
  return age >= minimum;
};



// чисто
var checkAge = function(age) {
  var minimum = 21;
  return age >= minimum;
};
```

У "не чистій" частині, функція `checkAge` у своїх підрахунках залежить від змінюємої(мутабельної) змінної `minimum`. Інакше кажучи, вона залежить від стану середовища, що не може не засмучувати, оскільки воно збільшує когнітивне навантаження шляхом введення зовнішнього середовища (а тепер зверніть увагу на назву книги, ключове слово - "переважно", переважно адекватне :) ).

У цьому прикладі це може здатись не на стільки вже й значущою проблемою, але ця залежність від стану є одним із основних внесків у складність всієї системи.(http://www.curtclifton.net/storage/papers/MoseleyMarks06a.pdf). Ця функція `checkAge` може повертати різні результати в залежності від факторів, котрі є сторонніми по відношенню до вхідних данних, що не тільки віддаляє її від так званої "чистоти", але ще й змушує нас напрягатись кожен раз, коли ми розмірковуємо над програмним забезпеченням.

А от ця чиста форма - абсолютно самодостатня. Ми можемо також зробити `minimum` іммутабельним(незмінюваним), що збереже чистоту, осткільки стан ніколи не зміниться. Щоб зробити це, нам потрібно всього лиш створити "заморожений" об'єкт.

```js
var immutableState = Object.freeze({
  minimum: 21,
});
```

## Під побічними ефектами ми розуміємо...

Давайте більш детальніше поглянемо на ці "побічні ефекти", для того, щоб покращити нашу інтуіцію. То щож це за такі мерзенні *побічні ефекти* про які згадувалось у визначенні *чистої функції*? Ми будемо посилатись на *ефекти*, як щось, що стається під час виконання наших розрахунків і не є безпосереднім вираховуванням результату.

Власне кажучи, немає нічого поганого в ефектах і ми будемо використовувати їх усюди а наступних розділах. А от *побічні* - це саме те, що несе в собі додаткове і негативне значення. Вода, сама по собі, не є інкубатором для личинок, але це *застій* води призводить до їх розмноження, і я вас запевняю, що *побічні* ефекти - це таке саме середовище в наших програмах.

>*Побічний ефект* - це зміна стану системи чи *видима взаємодія* з зовнішнім світом, що виникає в ході вирахунку результату.

Побічні ефекти включаються в себе(і не обмежуються лише цим переліком)

  * зміна файлової системи
  * внесення запису у базу данних
  * виконання http запиту
  * мутації
  * вивід на екран / логування
  * одержання користувацького вводу
  * запит до DOM
  * доступ до стану системи

І цей перелік можна продовжувати і продовжувати. Будь-яка взаємодія зі світом, який знаходиться поза межами функції є побічним ефектом, який, напевно, змусить вас засумніватися в практичності програмування без їх використання. Філософія функціонального програмування стоїть горою на тому, що побічні ефекти є головною причиною неправильної поведінки.

Не те щоб нам було суворо забороненно їх використовувати, ні, ми радше воліємо опанувати їх і використовувати контрольовано. Ми вивчимо як це робити, коли дістанемось до функторів і монад в подальших розділах, але покищо, давайте тримати ці підступні функції окремо від наших чистих.

Через побічні ефекти функція припиняє бути *чистою*. І в цьому є сенс: чисті функції, за визначенням, мають завжди повертати однаковий результат при однакових вхідних даних, що неможливо гарантувати, коли щось залежить від оточуючого світу поза межами конкретної функції.

Давайте більш ретельно розглянемо, чому ми наполягаємо на однакових результатах при однакових вхідних даних. Підніміть ваші комірці, бо зараз ми з вами поглянемо на математику за 8ий клас.

## Математика за 8ий клас

З mathisfun.com:

> Функція - спеціальни зв'язок між значеннями:
> Кожна її вхідна величина віддає рівно одне вихідне значення.

Інакше кажучи, це лише зв'язок між двума величинами: вхідними даними та результатом. Не дивлячись на те, що кожена вхідна величина має конкретно одне кінцеве значення, це не означає що кінцеве значення мусить бути унікальним для кожнної вхідної величини. Нижче наведена діаграма з ідеально валідною функцією:

<img src="images/function-sets.gif" alt="function sets" />(http://www.mathsisfun.com/sets/function.html)

На противагу цьому, наступна діаграмма демонструє зв'язок, що *не* є функцією, оскільки значення вхідної величини(`5`) веде до кількох рузельтатів:

<img src="images/relation-not-function.gif" alt="relation not function" />(http://www.mathsisfun.com/sets/function.html)

Фунції можуть бути описані як набір пар з положенням (вхідна величина, результат): `[(1,2), (3,6), (5,10)]` (Схоже на те, що ця функція подвоює отримувану величину).

Чи можлива таблиця:
<table> <tr> <th>Вхідна величина</th> <th>Результат</th> </tr> <tr> <td>1</td> <td>2</td> </tr> <tr> <td>2</td> <td>4</td> </tr> <tr> <td>3</td> <td>6</td> </tr> </table>

Чи навіть графік з `x` як вхідна величина та `y` як результат:

<img src="images/fn_graph.png" width="300" height="300" alt="function graph" />


Немає жодної потреба в деталях реалізації, до тих пір, поки вхідна величина диктує результат. А оскільки функції є простими поєднаннями вхідних величини та результатів, то можна побачити, що модна прибрати фігурні дужки і запустити функцію з `[]` замість `()`.

```js
var toLowerCase = {
  'A': 'a',
  'B': 'b',
  'C': 'c',
  'D': 'd',
  'E': 'e',
  'F': 'f',
};

toLowerCase['C'];
//=> 'c'

var isPrime = {
  1: false,
  2: true,
  3: true,
  4: false,
  5: true,
  6: false,
};

isPrime[3];
//=> true
```

Звісно, ви можете захотіти вираховувати замість вручну виписувати результати, але це демонструє різні способи думати про функції. (Ви можете подумати "а що ж щодо функції з кількома аргументами?". Дійсно, це трохи незручно, коли мислимо з точки зору математики. Покищо, ми можемо скласти їх в масив чи просто думати про об'єкт `arguments` як про вхідну величину. Коли ми почнемо вчити _каррування_, ми побачимо, як ми можемо безпосередньо моделювати математичне визначення функції).

І тут настає драматичне відкриття: чисті функції - це математичні функції, і саме це - функціональне програмування. Програмування за допомогою цих маленьких ангелів може забезпечити величезну користь. Давайте розглянемо деякі причини, чому ми можемо вдатись до великих довжин, заради збереження чистоти.

## Випадок для чистоти

### Здатність до кешування

Для початку, чисті функції завжди можуть бути закешовані вхідною величиною. Це робиться за допомогою техніки, яка називається _мемоізація_(memoization):

```js
var squareNumber = memoize(function(x) {
  return x * x;
});

squareNumber(4);
//=> 16

squareNumber(4); // повертає кеш для вхіного значення 4
//=> 16

squareNumber(5);
//=> 25

squareNumber(5); // повертає кеш для вхіного значення 5
//=> 25
```

Ось проста реалізація, хоча існує безліч більш надійних версій.

```js
var memoize = function(f) {
  var cache = {};

  return function() {
    var arg_str = JSON.stringify(arguments);
    cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
    return cache[arg_str];
  };
};
```

Варто відзначити, що ви можете перетворити деякі не чисті функції у чисті за допомогою відтермінування обчислення(evaluation):

```js
var pureHttpCall = memoize(function(url, params) {
  return function() {
    return $.getJSON(url, params);
  };
});
```

Цікавий момент тут це те, що ми не виконуємо http запит - ми, натомість, повертаємо функцію, яка виконає запит в момент коли її викличуть. Ця функція є чистою, бо вона завжди поверне однаковий результат при одному й тому самому вхідному значенні: фунцію, що виконає конкретний http запит з аргументами `url` та `params`.

Наша `memoize` функція працює чудово, не дивлячись на те, що вона не кешує результат http запиту, бо вона кешує згенеровану функцію.

Це, покищо, не дуже корисно, але ми скоро вивчимо деякі фокуси, які нам в цьому допоможуть. Висновок полягає в тому, що ми можемо кешувати кожну функцію, в не залежності наскільки руйнівною вона виглядає.

### Portable / Self-Documenting

Pure functions are completely self contained. Everything the function needs is handed to it on a silver platter. Ponder this for a moment... How might this be beneficial? For starters, a function's dependencies are explicit and therefore easier to see and understand - no funny business going on under the hood.

```js
//impure
var signUp = function(attrs) {
  var user = saveUser(attrs);
  welcomeUser(user);
};

var saveUser = function(attrs) {
    var user = Db.save(attrs);
    ...
};

var welcomeUser = function(user) {
    Email(user, ...);
    ...
};

//pure
var signUp = function(Db, Email, attrs) {
  return function() {
    var user = saveUser(Db, attrs);
    welcomeUser(Email, user);
  };
};

var saveUser = function(Db, attrs) {
    ...
};

var welcomeUser = function(Email, user) {
    ...
};
```

The example here demonstrates that the pure function must be honest about its dependencies and, as such, tell us exactly what it's up to. Just from its signature, we know that it will use a `Db`, `Email`, and `attrs` which should be telling to say the least.

We'll learn how to make functions like this pure without merely deferring evaluation, but the point should be clear that the pure form is much more informative than its sneaky impure counterpart which is up to God knows what.

Something else to notice is that we're forced to "inject" dependencies, or pass them in as arguments, which makes our app much more flexible because we've parameterized our database or mail client or what have you (don't worry, we'll see a way to make this less tedious than it sounds). Should we choose to use a different Db we need only to call our function with it. Should we find ourselves writing a new application in which we'd like to reuse this reliable function, we simply give this function whatever `Db` and `Email` we have at the time.

In a JavaScript setting, portability could mean serializing and sending functions over a socket. It could mean running all our app code in web workers. Portability is a powerful trait.

Contrary to "typical" methods and procedures in imperative programming rooted deep in their environment via state, dependencies, and available effects, pure functions can be run anywhere our hearts desire.

When was the last time you copied a method into a new app? One of my favorite quotes comes from Erlang creator, Joe Armstrong: "The problem with object-oriented languages is they’ve got all this implicit environment that they carry around with them. You wanted a banana but what you got was a gorilla holding the banana... and the entire jungle".

### Testable

Next, we come to realize pure functions make testing much easier. We don't have to mock a "real" payment gateway or setup and assert the state of the world after each test. We simply give the function input and assert output.

In fact, we find the functional community pioneering new test tools that can blast our functions with generated input and assert that properties hold on the output. It's beyond the scope of this book, but I strongly encourage you to search for and try *Quickcheck* - a testing tool that is tailored for a purely functional environment.

### Reasonable

Many believe the biggest win when working with pure functions is *referential transparency*. A spot of code is referentially transparent when it can be substituted for its evaluated value without changing the behavior of the program.

Since pure functions always return the same output given the same input, we can rely on them to always return the same results and thus preserve referential transparency. Let's see an example.

```js

var Immutable = require('immutable');

var decrementHP = function(player) {
  return player.set('hp', player.get('hp') - 1);
};

var isSameTeam = function(player1, player2) {
  return player1.get('team') === player2.get('team');
};

var punch = function(player, target) {
  return isSameTeam(player, target) ? target : decrementHP(target);
};

var jobe = Immutable.Map({
  name: 'Jobe',
  hp: 20,
  team: 'red',
});
var michael = Immutable.Map({
  name: 'Michael',
  hp: 20,
  team: 'green',
});

punch(jobe, michael);
//=> Immutable.Map({name:'Michael', hp:19, team: 'green'})
```

`decrementHP`, `isSameTeam` and `punch` are all pure and therefore referentially transparent. We can use a technique called *equational reasoning* wherein one substitutes "equals for equals" to reason about code. It's a bit like manually evaluating the code without taking into account the quirks of programmatic evaluation. Using referential transparency, let's play with this code a bit.

First we'll inline the function `isSameTeam`.

```js
var punch = function(player, target) {
  return player.get('team') === target.get('team') ? target : decrementHP(target);
};
```

Since our data is immutable, we can simply replace the teams with their actual value

```js
var punch = function(player, target) {
  return 'red' === 'green' ? target : decrementHP(target);
};
```

We see that it is false in this case so we can remove the entire if branch

```js
var punch = function(player, target) {
  return decrementHP(target);
};

```

And if we inline `decrementHP`, we see that, in this case, punch becomes a call to decrement the `hp` by 1.

```js
var punch = function(player, target) {
  return target.set('hp', target.get('hp') - 1);
};
```

This ability to reason about code is terrific for refactoring and understanding code in general. In fact, we used this technique to refactor our flock of seagulls program. We used equational reasoning to harness the properties of addition and multiplication. Indeed, we'll be using these techniques throughout the book.

### Parallel Code

Finally, and here's the coup de grâce, we can run any pure function in parallel since it does not need access to shared memory and it cannot, by definition, have a race condition due to some side effect.

This is very much possible in a server side js environment with threads as well as in the browser with web workers though current culture seems to avoid it due to complexity when dealing with impure functions.


## In Summary

We've seen what pure functions are and why we, as functional programmers, believe they are the cat's evening wear. From this point on, we'll strive to write all our functions in a pure way. We'll require some extra tools to help us do so, but in the meantime, we'll try to separate the impure functions from the rest of the pure code.

Writing programs with pure functions is a tad laborious without some extra tools in our belt. We have to juggle data by passing arguments all over the place, we're forbidden to use state, not to mention effects. How does one go about writing these masochistic programs? Let's acquire a new tool called curry.

[Chapter 4: Currying](ch4.md)
