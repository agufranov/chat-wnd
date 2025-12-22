export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        diagnostics: {
          ignoreCodes: [2307],
        },
      },
    ],
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  roots: ["<rootDir>/src"],
  modulePaths: ["<rootDir>/src"],
};
