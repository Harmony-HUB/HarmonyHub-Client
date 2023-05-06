module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^(.+\\.(jpe?g|png|gif|ttf|eot|woff(2)?|svg|css|scss|mp3|m4a|aac|oga))$":
      "<rootDir>/__mocks__/fileMock.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios|node-fetch|data-uri-to-buffer)/)",
  ],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
};
