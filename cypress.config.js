const { defineConfig } = require("cypress");

module.exports = defineConfig({
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
