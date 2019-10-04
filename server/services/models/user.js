'use strict'

module.exports = function (sequelize, DataTypes) {
    const user = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        permissionLevel: {
            type: DataTypes.INTEGER
        }
    });

    //Associations
    //Employee

    return user;
};
