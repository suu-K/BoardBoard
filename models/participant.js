'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      participant.belongsTo(models.post, {
        foreignKey: "postId",
        targetKey: "id"
      });
      participant.belongsTo(models.user, {
        foreignKey: "userId",
        targetKey: "id"
      });
    }
  };
  participant.init({
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    accept: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'participant',
  });
  return participant;
};