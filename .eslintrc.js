module.exports = {
  root: true,
  globals: {
    $authz: true,
    $store: true,
    $el: true,
    eventBus: true,
    $route: true
  },
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier', 'plugin:vuetify/base'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/multi-word-component-names': 'off',
    'no-async-promise-executor': 'off',
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/no-v-for-template-key': 'off',
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore'
      }
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ]
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    babelOptions: {
      presets: ['@babel/preset-env']
    },
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
      optionalChaining: true
    }
  }
}
