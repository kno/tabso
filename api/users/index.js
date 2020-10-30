import Router from 'express';
import Models from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UsersModels = Models.user;

const UsersRoutes = Router()
  .post('/login', async (req, res) => {
    console.log('login')
    try {
      const user = await UsersModels.findOne({
        where: {
          username: req.body.username
        }
      });
      if (!user || !bcrypt.compareSync(req.body.password, user.password, 10)) {
        return res.status(401).json();
      }
      const payload = {
        id: user.id,
        username: user.username
      };
      const token = jwt.sign(payload, req.app.get('key'), {expiresIn: 1440});
      res.json({
        token: token
      });
    } catch (err) {
      console.log(err)
      res.status(403).send();
    }
  })
  .post('/register', async (req, res) => {
    try {
      const user = await UsersModels.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone
      });
      const payload = {
        id: user.id,
        username: user.username
      };
      const token = jwt.sign(payload, req.app.get('key'), {expiresIn: 1440});
      res.json({
        token: token
      });
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  })
;
export default UsersRoutes;
