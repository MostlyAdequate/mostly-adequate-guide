const fs = require('fs');
const path = require('path');
const { it } = require('mocha');
const {
  compose,
  concat,
  curry,
  forEach,
  map,
  reduce,
} = require('./support');


/* -------- Internal -------- */

const filenameRe = base => new RegExp(`${base}_([a-z]).js`);

const readDir = d => fs.readdirSync(d);

const readFile = f => fs.readFileSync(f).toString('utf-8');

const mconcat = zero => reduce(concat, zero);

const evalFiles = compose(eval, mconcat(''), map(readFile)); // eslint-disable-line no-eval

const listToMap = xs => xs.reduce((m, [k, v]) => m.set(k, v), new Map());


/* -------- Utils -------- */

const readExercises = (ch, sections = ['exercise', 'solution', 'validation']) => {
  const folder = path.join(__dirname, ch);

  const partition = reduce((pts, f) => {
    forEach((section) => {
      const re = filenameRe(section);

      if (re.test(f)) {
        const spec = re.exec(f)[1];
        pts.get(section).set(spec, path.join(folder, f));
      }
    }, sections);

    return pts;
  }, listToMap(map(s => [s, new Map()], sections)));

  return partition(readDir(folder));
};

const defineSpecs = curry((input, exercises) => {
  const support = path.join(__dirname, 'support.js');

  forEach(([num, exercise]) => {
    it(`exercise_${num}`, () => {
      const validation = exercises.get('validation').get(num);

      evalFiles([support, exercise, validation]);
    });
  }, [...exercises.get(input)]);
});

const runSolutions = compose(defineSpecs('solution'), readExercises);

const runExercises = compose(defineSpecs('exercise'), readExercises);


module.exports = {
  readExercises,
  defineSpecs,
  runSolutions,
  runExercises,
};
