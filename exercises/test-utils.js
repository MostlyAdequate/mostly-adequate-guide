#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cli = require('cli');
const process = require('process');
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

const writeFile = curry((f, data) => fs.writeFileSync(f, data));

const mkdir = d => fs.mkdirSync(d);

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


/* -------- Cli -------- */

if (process.argv.length > 2 && process.argv[1] === __filename) {
  const usage = `Usage: test-utils new

Available options:
  -h, --help                Show this help text
  -c, --chapter             New chapter to create`;

  const spec = curry((runner, chapter) => `const { describe } = require('mocha');
const { ${runner} } = require('../test-utils');

describe('Exercises Chapter ${chapter}', () => {
  ${runner}('ch${chapter}');
});`);

  const addTestScript = curry((pkg, chapter) => {
    const { scripts } = pkg;

    return {
      ...pkg,
      scripts: {
        ...scripts,
        [`ch${chapter}`]: `mocha test/ch${chapter}.js`,
      },
    };
  });

  const failWith = curry((ctx, msg) => {
    ctx.fatal([msg, usage].join('\n\n'));
  });

  // NOTE Override the `getUsage` method of the cli which is... not satisfactory.
  cli.getUsage = () => { console.error(usage); cli.exit(0); }; // eslint-disable-line no-console

  cli.parse({
    chapter: ['c', 'New chapter to create', 'int'],
  });

  cli.main(function main(args, options) {
    cli.failWith = failWith(this);

    if (args.length !== 1 || args[0] !== 'new') {
      cli.failWith(`Unknown command: ${args.join(' ')}`);
    }

    if (!options.chapter) {
      cli.failWith('Missing required Chapter');
    }

    if (readDir(__dirname).includes(`ch${options.chapter}`)) {
      cli.failWith(`Chapter ${options.chapter} already exists`);
    }

    mkdir(path.join(__dirname, `ch${options.chapter}`));

    writeFile(
      path.join(__dirname, 'test', `ch${options.chapter}.js`),
      spec('runExercises', options.chapter),
    );

    writeFile(
      path.join(__dirname, 'test', `ch${options.chapter}.solutions.js`),
      spec('runSolutions', options.chapter),
    );

    const pkg = addTestScript(require('./package.json'), options.chapter); // eslint-disable-line global-require

    writeFile(
      path.join(__dirname, 'package.json'),
      JSON.stringify(pkg, null, 2),
    );

    console.error(`Bootstrapped Chapter ${options.chapter}.`); // eslint-disable-line no-console
  });
}


/* -------- Exports -------- */

module.exports = {
  readExercises,
  defineSpecs,
  runSolutions,
  runExercises,
};
