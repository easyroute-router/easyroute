module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!@easyroute/core)'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.js?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
