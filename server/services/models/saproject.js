'use strict'

module.exports = function (sequelize, DataTypes) {
    const saproject = sequelize.define('saproject', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        projectname: {
            type: DataTypes.STRING(50)
        },
        employeeid: {
            //fk of saemployee table
            type: DataTypes.INTEGER,
            required: true,
            allowNull: false
        }
    });
    
    
    //Projects
    saproject.associate = function(models){
        saproject.belongsTo(models.saemployee, {as: 'employeeprojects', foreignKey: 'employeeid'})
      }

    return saproject;
};
