import Router from 'express';
import webPush from 'web-push';
import  urlBase64 from 'urlsafe-base64';
import ProtectedRoutes from '../middleware';
import Models from '../models';

const UsersModel = Models.user;

const VAPID_KEY = {
  publicKey: 'BJjeh_rSJo9OKpM9RSw6Y8VmZm5zSV4zk-y7hvIxki84d0cBjrH2IGOrt6Mp0A04CIcGmvMn-mGceXSulS00X5E',
  privateKey: '5MXoI9iRVJ4G4nw02wzkj2sysMypadH9byFt6SOxH5g'
};

webPush.setVapidDetails('http://localhost', VAPID_KEY.publicKey, VAPID_KEY.privateKey);

const UsersRoutes = Router()
  .get('/vapidPublicKey', ProtectedRoutes, async (req, res) => {
    res.json({
      publicKey: VAPID_KEY.publicKey
    })
  })
  .post('/register', ProtectedRoutes, async (req, res) => {
    const user = await UsersModel.findByPk(req.decodedUser.id);
    if (!user) {
      res.sendStatus(403);
    }
    user.subscription = JSON.stringify(req.body);
    await user.save();
    res.json(user);
  })

  .post('/sendNotification', async (req,res) => {
    const user = await UsersModel.findByPk(req.decodedUser.id);
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
      TTL: req.body.ttl
    };

    try {
      await webPush.sendNotification(subscription, null, options)
      res.sendStatus(201);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })
  .get('/test', async (req, res) => {
    try {
      const user = await UsersModel.findByPk(6);
      const notificationResult = await webPush.sendNotification(
        JSON.parse(user.subscription),
        "hola mundo!",
        {
          vapidDetails: {
            subject: 'https://www.tabso.com',
            publicKey: urlBase64.encode(VAPID_KEY.publicKey),
            privateKey: urlBase64.encode(VAPID_KEY.privateKey)
          },
          contentEncoding: 'aesgcm',
          TTL: 5
        }
      );
      console.log(notificationResult);
      res.sendStatus(200);
    } catch (e) {{
      console.log(e);
      res.sendStatus(500);
    }}
  })
;

const sendNotification = async (userId, text) => {
  const user = await UsersModel.findByPk(userId);
  if (!user || !user.subscription) {
    return;
  }

  const notificationResult = await webPush.sendNotification(
    JSON.parse(user.subscription),
    text,
    {
      vapidDetails: {
        subject: 'https://www.tabso.com',
        publicKey: urlBase64.encode(VAPID_KEY.publicKey),
        privateKey: urlBase64.encode(VAPID_KEY.privateKey)
      },
      contentEncoding: 'aesgcm',
      TTL: 5
    }
  );
};

export {sendNotification};

export default UsersRoutes;
