import Router from 'express';

const Users = Router();
Users.use('/login/', (req, res) => {
  if (req.body.user == 'asdf' && req.body.password === '123'){
    const payload = {
      id: 1
    };
    const token = jwt.sign(payload, req.app.get('key'), {expiresIn: 1440});
    res.json({
      msg: 'authenticated',
      token: token
    })
  } else {
    res.status(401).json({msg: 'user/password incorrect'});
  }
});

export default Users;
