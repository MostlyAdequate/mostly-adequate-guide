# Chapter 5 Notes

- Pointfree style: functions that never mention the data upon which they operate
- Be warned, however, pointfree is a double-edged sword and can sometimes obfuscate intention. Not all functional code is pointfree and that is O.K.

## Common Mistakes

A common mistake is to compose something like map, a function of two arguments, without first partially applying it.
```
// wrong - we end up giving angry an array and we partially applied map with who knows what.
const latin = compose(map, angry, reverse);

latin(['frog', 'eyes']); // error

// right - each function expects 1 argument.
const latin = compose(map(angry), reverse);

latin(['frog', 'eyes']); // ['EYES!', 'FROG!'])
```

## Similarities to Elixir

- "pipe" -> `|>`
- "trace" -> `dbg()`
- "category theory" -> `set theoretic types`


## Category Theory
1. collection of objects -> `String, Boolean, Number`
2. collection of morphisms -> `pure functions`
3. notion of composition on the morphisms -> `compose`
4. distinguished morphism called identity -> `const id = x => x` (it's a function that acts as a stand in for a given value. This is quite useful when writing pointfree code.)



```const foo = '123'```
vs.
```compose(id)``` (pointfree, yay)