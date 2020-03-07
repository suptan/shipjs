module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest/globals": true
  },
  "plugins": ["jest"],
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    // enable additional rules
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "semi": ["error", "always"],

    // disable rules from base configurations
    "no-console": "off",
  }
};