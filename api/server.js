import express from 'express';
import bodyParser from 'body-parser';
import config from './configs/config.js';
import RutasProtegidas from './middleware.js'
import Users from './users/index.js';

const app = express();
app.set('key', config.key);
app.use(bodyParser.urlencoded(( {extended: true})));
app.use(bodyParser.json());

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

app.get('/', (_, res) => {
  res.send('start');
});

app.use('/users', Users);

app.get('/protected', RutasProtegidas, (_, res) => {
  res.send('Protected route');
});
