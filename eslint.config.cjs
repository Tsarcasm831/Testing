const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      indent: ['error', 2]
    }
  }
];
