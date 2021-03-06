import Router from 'express';
import Models from '../models';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const UsersModel = Models.user;

const UsersRoutes = Router()
  .post('/login', async (req, res) => {
    try {
      const user = await UsersModel.findOne({
        where: {
          username: req.body.username
        }
      });
      if (!user || !bcrypt.compareSync(req.body.password, user.password, 10)) {
        return res.status(401).json();
      }
      const payload = {
        id: user.id,
        username: user.username,
        userType: user.type
      };
      delete user.dataValues.password;
      const token = jwt.sign(payload, req.app.get('key'), {expiresIn: 1440});
      res.json({
        token: token,
        user: user
      });
    } catch (err) {
      console.log(err)
      res.status(403).send();
    }
  })
  .post('/register', async (req, res) => {
    if (!['deliverer', 'recipient'].includes(req.body.type)) {
      return res.status(500).json();
    }
    try {
      const user = await UsersModel.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        type: req.body.type
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
