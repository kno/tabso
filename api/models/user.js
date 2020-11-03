'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
//      this.hasMany(models['delivery'], {as: 'deliverer'});
//      this.hasMany(models['delivery'], {as: 'recipient'});
    }
  };
  user.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: DataTypes.CHAR,
    type: DataTypes.STRING,
    subscription: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};