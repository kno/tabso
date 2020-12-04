const home = require("./pages/home");

describe('TABSO', function() {
  test('remote', (browser) => {
    const homePage = browser.page.home();
    const loginPage = browser.page.login();

    homePage
      .navigate()
      .waitForElementVisible('@loginButton')
      .click('@loginButton')
      .assert.urlEquals(loginPage.url());
    loginPage
      .setValue('@username', 'deliverer1')
      .setValue('@password', '123')
      .click('@submitButton')
      .assert.containsText('.container', 'This is a beautiful dashboard')
  });
});