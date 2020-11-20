import jwt from 'jsonwebtoken';

const ProtectedRoutes = ((req, res, next) => {
  const token = req.header('Authorization');

  if (token) {
    jwt.verify(token, req.app.get("key"), (err, decoded) => {
      if (err) {
        return res.status(401).json({msg: 'Invalid Token'});
      }
      req.decodedUser = decoded;
      next();
    })
  } else {
    res.status(401).send();
  }
});

export default ProtectedRoutes;