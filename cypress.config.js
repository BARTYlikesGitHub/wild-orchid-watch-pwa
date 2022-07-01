const {
  defineConfig
} = require("cypress");

module.exports = defineConfig({
  hosts: {
    'auth.corp.com': '127.0.0.1',
  },
  fixturesFolder: false,
  e2e: {
    chromeWebSecurity: false,
    baseUrl: 'http://localhost:8080',
    pageLoadTimeout: 20000,
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here

    },
  },
});