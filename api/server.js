import express from 'express';
import bodyParser from 'body-parser';
import config from './configs/config';
import ProtectedRoutes from './middleware'
import {Users, Deliveries} from './controllers/index';

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
app.use('/deliveries', Deliveries)

app.get('/protected', ProtectedRoutes, (_, res) => {
  res.send('Protected route');
});
