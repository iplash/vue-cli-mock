module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "max-len": ["error", {
      "code": 300,
      "ignoreRegExpLiterals": true
    }],
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'acc', // for reduce accumulators
        'accumulator', // for reduce accumulators
        'e', // for e.returnvalue
        'ctx', // for Koa routing
        'req', // for Express requests
        'request', // for Express requests
        'res', // for Express responses
        'response', // for Express responses
        '$scope', // for Angular 1 scopes
        'staticContext', // for ReactRouter context
        'state', // for Vuex state no-param-reassign
        'config', // for axios config no-param-reassign
      ],
    }],
    'no-shadow': ['error', {
      builtinGlobals: false,
      hoist: 'functions',
      allow: ['state'],
    }],
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": true
    }],
    "consistent-return": "error"
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
