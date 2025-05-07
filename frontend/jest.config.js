// jest.config.js
module.exports = {
  // The root directory for Jest to scan for tests
  roots: ['<rootDir>/src'],
  
  // The test environment to use
  testEnvironment: 'jsdom',
  
  // File patterns to match for test files
  testMatch: ['**/__tests__/**/*.test.js'],
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/setupTests.js'],
  
  // Transform files using Babel
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Mock all CSS file imports to avoid issues with Jest
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__tests__/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__tests__/__mocks__/fileMock.js',
  },
  
  // Include axios and other ESM modules in transformation
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|react-pdf|pdfjs-dist)/)',
  ],
  
  // Coverage settings
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/__tests__/**'],
  coverageDirectory: 'coverage',
};