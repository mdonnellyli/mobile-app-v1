// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(expo' +
      '|@expo' +
      '|expo-router' +
      '|expo-modules-core' +
      '|react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|@react-native-async-storage' +
      ')/)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.history/',       // 👈 ignore any files in the .history folder
    '/build/',          // optionally ignore build output
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  setupFilesAfterEnv: [
  './jestSetup.js',
  '@testing-library/jest-native/extend-expect',
  ],
  // ✅ Coverage options:
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{js,ts,jsx,tsx}',
    'screens/**/*.{js,ts,jsx,tsx}',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ['text', 'lcov','html'],
};