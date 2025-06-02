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
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  setupFilesAfterEnv: [
  './jestSetup.js',
  '@testing-library/jest-native/extend-expect',
  ],
};