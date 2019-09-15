'use strict'

module.exports = function (sequelize, DataTypes) {
    const sasalary = sequelize.define('sasalary', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        salaryamount: {
            type: DataTypes.DECIMAL(10,2)
        },
        employeeid: {
            //fk of saemployee table
            type: DataTypes.INTEGER,
            required: true,
            allowNull: false
        }
    });
    
    
    //Projects
    sasalary.associate = function(models){
        sasalary.belongsTo(models.saemployee, {as: 'employeesalary', foreignKey: 'employeeid'})
      }

    return sasalary;
};
