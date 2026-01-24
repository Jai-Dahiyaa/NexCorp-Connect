export default {
  testEnvironment: "node",
  testTimeout: 30000,
  verbose: true,
  transform: {},
  moduleFileExtensions: ["js", "mjs"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  forceExit: true,
  detectOpenHandles: true
};
