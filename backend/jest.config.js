export default {
  testEnvironment: "node",
  verbose: true,
  transform: {},
  moduleFileExtensions: ["js"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  setupFilesAfterEnv: ['./jest.setup.js'],
};
