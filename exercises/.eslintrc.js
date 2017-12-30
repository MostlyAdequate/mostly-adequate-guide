const globals = Object
  .keys(require('./support'))
  .reduce((o, k) => ({ ...o, [k]: true }), { requirejs: true, assert: true });

module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    amd: true,
  },
  globals,
  rules: {
    'import/no-amd': 0,
    'import/no-dynamic-require': 0,
    'no-unused-vars': 0,
    'object-curly-newline': [2, {
      multiline: true,
      consistent: true,
      minProperties: 5,
    }],
  },
};
