module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(axios)/)"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
};
