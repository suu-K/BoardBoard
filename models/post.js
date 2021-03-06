'use strict';
const {
  Model
} = require('sequelize');
const { sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here)
      post.hasMany(models.reply, { foreignKey: "postId", sourceKey: "id" });
      post.hasMany(models.participant, { foreignKey: "postId", sourceKey: "id"});
      post.belongsTo(models.user, {
        foreignKey: "writerId",
        sourceKey: "id"
      });
    }
  };
  post.init({
    writerId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    place: DataTypes.STRING,
    content: DataTypes.TEXT,
    date: DataTypes.DATEONLY,
    max: DataTypes.INTEGER,
    view: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'post', 
  });
  return post;
};