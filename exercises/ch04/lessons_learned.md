# Lessons Learned
- If you see a function with the shape:

  ```javascript
  b => someFunction(a, b)
  ```

  where b is a curried function, that's equivalent to:

  ```javascript
  someFunction(a)
  ```

- If you see a function call like:

  ```javascript
  b.someFunction(a)
  ```

  that's equivalent to calling the curried function

  ```javascript
  someFunction(a)
  ```
