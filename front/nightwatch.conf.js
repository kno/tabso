module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ["tests"],
  page_objects_path: "tests/pages",
  exclude: ["tests/pages", "tests/config"],

  webdriver: {
    start_process: true,
    port: 9515,
    server_path: require('chromedriver').path
  },

  test_settings: {
    default: {
      launchUrl: 'http://localhost:8080',
      desiredCapabilities : {
        browserName : 'chrome',
        chromeOptions: {
          args: [
            //"--headless"
          ]
        }
      }
    },
    staging: {
      launchUrl: 'https://tabso-front.herokuapp.com'
    }
  }
};
