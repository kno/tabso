import Router from 'express';
import Models from '../models';
import ProtectedRoutes from '../middleware';

const DeliveriesModel = Models.delivery;
const UsersModel = Models.user;

const DeliveriesRoutes = Router()
  .post('/create', ProtectedRoutes, async (req, res) => {
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
        date: new Date()
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
;

export default DeliveriesRoutes;
