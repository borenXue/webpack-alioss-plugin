module.exports = {
  "root": true,
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "env": {
    "node": true
  },
  "globals": {
    "Promise": true,
    // mocha 相关
    "describe": true,
    "it": true,
  },
  "extends": "eslint:recommended"
}
