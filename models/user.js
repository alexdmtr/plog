const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')
const saltRounds = 12;
var Promise = require('bluebird')

function hashPassword(user) {
  return bcrypt
      .hash(user.password, saltRounds)
        .then(function(hash) {
          user.password = hash
          return Promise.resolve()
        })
   
}
module.exports = function(sequelize) {
    var User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING(256),
            unique: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(256),
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        // avatarUrl: Sequelize.STRING(500),
        // age: Sequelize.INTEGER,
        // currentProject: Sequelize.STRING(500),
        // agency: Sequelize.STRING(500),
    }, {
      timestamps: false,
      hooks: {
        beforeCreate: function(user) {
          if (user.changed('password'))
            return hashPassword(user)
        },
        beforeSave: function(user) {
          if (user.changed('password')) 
            return hashPassword(user)
        },
        beforeBulkCreate: function(instances) {
          var tasks = instances.map(function(instance) {
            return hashPassword(instance)
          })

          return Promise.all(tasks)
        }
      }
    })
    return User
}