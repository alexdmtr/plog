const Sequelize = require('sequelize')

module.exports = function (sequelize) {
  var Post = sequelize.define('post', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: {
      type: Sequelize.STRING(500)
    },
    title: {
      type: Sequelize.STRING(100)
    }
  }, {
    timestamps: true
  })

  return Post
}