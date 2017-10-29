const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    var Group = sequelize.define('group', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(500),
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(500),
            allowNull: false
        },
        avatarUrl: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        timestamps: false
    })
    return Group
}