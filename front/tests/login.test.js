describe('TABSO', function() {

  test('login', function(browser) {
    browser
      .url('http://localhost:8080/')
      .click('#btn_login')
      .setValue('input[name=userid]', 'deliverer1')
      .setValue('input[name=password]', '123')
      .click('button[type=submit]')
      .assert.containsText('.container', 'This is a beautiful dashboard')
      .end();
  });

});