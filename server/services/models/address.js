'use strict'

module.exports = function (sequelize, DataTypes) {
    const address = sequelize.define('address', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        addressType: {
            type: DataTypes.STRING
        },
        firstLine: {
            type: DataTypes.STRING
        },
        secondLine: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        pincode: {
            type: DataTypes.INTEGER
        },
        employeeid: {
            //fk of saemployee table
            foreignKey: true,
            type: DataTypes.INTEGER,
            required: true,
            allowNull: false
        }
    });
    
    
    //Projects
    address.associate = function(models){
        address.belongsTo(models.employee, {as: 'employeeaddress', foreignKey: 'employeeid'})
      }

    return address;
};
