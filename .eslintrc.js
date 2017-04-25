module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true
  },
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
  },
  extends: 'standard',
  plugins: [],
  'rules': {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'semi': 1,
    'no-trailing-spaces': 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
