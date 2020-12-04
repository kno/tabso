module.exports = {
  baseUrl: () => {
    console.log(process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
      case 'dev':
        return 'http://localhost:3000';
      case 'stage':
        return 'https://tabso-front.herokuapp.com';
      case 'production':
        return 'https://tabso.com'
    }
  }
};