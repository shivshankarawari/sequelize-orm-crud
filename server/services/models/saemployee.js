'use strict'

module.exports = function (sequelize, DataTypes) {
    const saemployee = sequelize.define('saemployee', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstname: {
            type: DataTypes.STRING(50)
        },
        lastname: {
            type: DataTypes.STRING(50)
        },
        startdate: {
            type: DataTypes.DATE
        }
    });

    //Associations
    //Employee
    saemployee.associate = function(models){
        saemployee.hasMany(models.saproject, { as : 'saproject', foreignKey: 'employeeid' });
        saemployee.hasOne(models.sasalary, { as: 'sasalary', foreignKey: 'employeeid' });
      } 

    return saemployee;
};
