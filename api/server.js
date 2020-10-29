import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
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

app.post('/users', Users);
app.post('/login', (req, res) => {
  if (req.body.user == 'asdf' && req.body.password === '123'){
    const payload = {
      id: 1
    };
    const token = jwt.sign(payload, app.get('key'), {expiresIn: 1440});
    res.json({
      msg: 'authenticated',
      token: token
    })
  } else {
    res.status(401).json({msg: 'user/password incorrect'});
  }
});

app.get('/protected', RutasProtegidas, (_, res) => {
  res.send('Protected route');
});
