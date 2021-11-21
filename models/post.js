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
      // define association here
    }
  };
  post.init({
    writerId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    place: DataTypes.STRING,
    content: DataTypes.TEXT,
    date: DataTypes.DATEONLY,
    view: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'post', 
  });
  post.associate = function (models) {
    post.hasMany(models.reply);
    post.belongsTo(models.user, {
      foreignKey: "writerId",
      sourceKey: "id"
    })
  };
  return post;
};