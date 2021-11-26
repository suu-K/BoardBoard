'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reply.belongsTo(models.post, {
        foreignKey: "postId",
        sourceKey: "id"
      });
      reply.belongsTo(models.user, {
        foreignKey: "writerId",
        sourceKey: "id"
      });
    }
  };
  reply.init({
    postId: DataTypes.INTEGER,
    writerId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    accept: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'reply',
  });
  return reply;
};