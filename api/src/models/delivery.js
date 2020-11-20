'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class delivery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models['user'], {as: 'deliverer', foreignKey: 'delivererId'});
      this.belongsTo(models['user'], {as: 'recipient', foreignKey: 'recipientId'});
    }
  };
  delivery.init({
    date: DataTypes.DATE,
    delivererId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    status: DataTypes. INTEGER
  }, {
    sequelize,
    modelName: 'delivery',
  });
  return delivery;
};