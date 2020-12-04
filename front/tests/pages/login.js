const header = require('./components/header.js');

module.exports = {
  url: function() {
    return this.api.launchUrl + '/login';
  },
  elements: {
    ...header.elements,
    username: 'input[name=userid]',
    password: 'input[name=password]',
    submitButton: 'button[type=submit]'
  }
};