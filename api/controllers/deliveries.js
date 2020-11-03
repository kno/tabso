import Router from 'express';
import Models from '../models';
import ProtectedRoutes from '../middleware';

const DeliveriesModel = Models.delivery;
const UsersModel = Models.user;
const DELIVERY_STATUS = {
  PROPOSED: 0,
  ACCEPTED: 1,
  NOT_ACCEPTED: 2,
  REPLANNED: 3,
}

const DeliveriesRoutes = Router()
  .post('/', ProtectedRoutes, async (req, res) => {
    if (req.decodedUser.userType !== 'deliverer') {
      return res.status(403).json();
    }
    try {
      const recipient = await UsersModel.findOne({
        where: {
          phone: req.body.recipientPhone,
          type: 'recipient'
        }
      });
      if (!recipient) {
        return req.status(404).json();
      }
      const delivery = await DeliveriesModel.create({
        delivererId: req.decodedUser.id,
        recipientId: recipient.id,
        date: new Date(),
        status: DELIVERY_STATUS.PROPOSED
      }, {
        include: [
          {model: UsersModel, as: 'deliverer'},
          {model: UsersModel, as: 'recipient'}
        ]
      });
      res.json(delivery);
    } catch (error) {
      console.log(error);
      return res.status(500).json();
    }
    res.status(500).json();
  })
  .post('/accept', ProtectedRoutes, async (req, res) => {
    try {
    const delivery = await DeliveriesModel.findOne({
      where: {
        id: req.body.deliveryId,
        recipientId: req.decodedUser.id,
        status: DELIVERY_STATUS.PROPOSED
      }});
      delivery.status = DELIVERY_STATUS.ACCEPTED;
      await delivery.save();
      res.json(delivery);
    } catch (error) {
      console.log(error);
      return res.status(500).json();
    }
    return res.status(500).json();
  })
;

export default DeliveriesRoutes;