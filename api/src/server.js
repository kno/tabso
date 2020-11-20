import express from 'express';
import bodyParser from 'body-parser';
import config from './configs/config';
import ProtectedRoutes from './middleware';
import { Users, Deliveries, Notifications } from './controllers/index';
import cors from 'cors';

const app = express();
app.use(cors());
app.set('key', config.key);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started in port ${port}`);
});

app.get('/', (_, res) => {
  res.send('start');
});

app.use('/users', Users);
app.use('/deliveries', Deliveries);
app.use('/notifications', Notifications);

app.get('/protected', ProtectedRoutes, (_, res) => {
  res.send('Protected route');
});