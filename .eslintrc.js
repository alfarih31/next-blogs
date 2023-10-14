module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: ['*.cjs', 'tsconfig.json', '.eslintrc.js', 'next.config.js', 'dist/**/*', '.next/**/*'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'next',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false,
        },
      },
    ],
    'react/jsx-max-props-per-line': [1, { when: 'multiline' }],
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 1,
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      },
    ],
    'max-classes-per-file': 0,
    'no-underscore-dangle': 0,
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'enum',
        format: ['UPPER_CASE'],
      },
    ],
    'consistent-return': 0,
    'no-param-reassign': 0,
    'import/prefer-default-export': 0,
  },
};
