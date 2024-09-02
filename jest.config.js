/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
}
