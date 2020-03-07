// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/service/*.(js)",
    "src/util/*.(js)",
    "src/authorization/*.(js)",
    "src/middleware/*.(js)"
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  coverageReporters: [
    'html',
    'text-summary',
  ],

  moduleDirectories: [
    'node_modules',
    'src',
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json'],

  moduleNameMapper: {},

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/units/**/*.js', '**/?(*.)+(spec|test).js'],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testURL: 'http://localhost',

  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest',
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  // Indicates whether each individual test should be reported during the run
  verbose: false,
};
