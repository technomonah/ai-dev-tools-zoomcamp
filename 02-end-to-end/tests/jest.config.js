module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/integration'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    '../server/src/**/*.ts',
    '!../server/src/**/*.d.ts',
  ],
  coverageDirectory: './coverage',
  verbose: true,
};
