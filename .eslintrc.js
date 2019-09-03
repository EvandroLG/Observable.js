module.exports = {
  extends: 'airbnb-base',

  rules: {
    'arrow-parens': 0,
    'no-underscore-dangle': 0,
  },

  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
};
