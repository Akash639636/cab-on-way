'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsersSubscription.init({
    userId: DataTypes.INTEGER,
    paymentId: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    expiredOn: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UsersSubscription',
  });
  return UsersSubscription;
};