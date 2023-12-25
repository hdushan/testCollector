module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  verbose: true
}

process.env = Object.assign(process.env, {
  NEW_RELIC_APP_NAME: 'TEST',
  NEW_RELIC_ACCOUNT_ID: 'TEST',
  NEW_RELIC_LICENSE_KEY: 'TEST'
})