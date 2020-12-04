const header = require('./components/header.js');

module.exports = {
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    ...header.elements
  }
};