module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'ES2021',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
  }
}
