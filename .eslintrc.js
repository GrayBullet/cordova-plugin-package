module.exports = {
  extends: 'google',
  env: {
    node: true
  },
  rules: {
    'max-len': [2, 120],
    'space-before-function-paren': [2, {
      anonymous: 'always',
      named: 'never'
    }]
  }
};
