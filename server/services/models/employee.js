'use strict'

module.exports = function (sequelize, DataTypes) {
    const employee = sequelize.define('employee', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(50)
        },
        lastName: {
            type: DataTypes.STRING(50)
        },
        emailId: {
            type: DataTypes.STRING(50)
        },
        designation: {
            type: DataTypes.STRING(50)
        },
        active: {
            type: DataTypes.BOOLEAN
        }
    });

    //Associations
    //Employee
    employee.associate = function(models){
        employee.hasMany(models.project, { as : 'project', foreignKey: 'employeeid' });
        employee.hasMany(models.address, { as: 'address', foreignKey: 'employeeid' });
      } 

    return employee;
};
