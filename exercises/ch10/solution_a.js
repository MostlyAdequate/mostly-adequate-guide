const safeAdd = curry((a, b) => Maybe.of(add).ap(a).ap(b));
