export default {
  testEnvironment: 'node',
  transform: {}, 
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['<rootDir>/src/tests/setup/env.js'],
  testTimeout: 60000,
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageThreshold: {
    global: { statements: 60, branches: 60, functions: 45 },
  },
};
