import Router from 'express';
import webPush from 'web-push';

const VAPID_KEY = {
  publicKey: 'BJjeh_rSJo9OKpM9RSw6Y8VmZm5zSV4zk-y7hvIxki84d0cBjrH2IGOrt6Mp0A04CIcGmvMn-mGceXSulS00X5E',
  privateKey: '5MXoI9iRVJ4G4nw02wzkj2sysMypadH9byFt6SOxH5g'
};

webPush.setVapidDetails('http://localhost', VAPID_KEY.publicKey, VAPID_KEY.privateKey);

const payloads = {};

const UsersRoutes = Router()
  .get('/vapidPublicKey', (req, res) => {
    res.json({
      publicKey: VAPID_KEY.publicKey
    })
  })
  .post('/register', async (req, res) => {
    console.log(req.body);
    res.sendStatus(201);
  })

  .post('/sendNotification', async (req,res) => {
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
      TTL: req.body.ttl
    };

    payloads[req.body.subscription.endpoint] = payload;
    try {
      await webPush.sendNotification(subscription, null, options)
      res.sendStatus(201);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })
  .get('/getPayload', (req, res) => {
    res.json({
      payloads: payloads[req.query.endpoint]
    })
  })
;

export default UsersRoutes;