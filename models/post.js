'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
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
    content: DataTypes.TEXT,
    date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'post',
  });
  post.associate = function (models) {
    post.hasMany(models.reply);
  };
  return post;
};