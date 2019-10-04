'use strict'

module.exports = function (sequelize, DataTypes) {
    const project = sequelize.define('project', {
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
            foreignKey: true,
            unique:true,
            type: DataTypes.INTEGER,
            required: true,
            allowNull: false
        }
    });
    
    
    //Projects
    project.associate = function(models){
        project.belongsTo(models.employee, {as: 'employeeprojects', foreignKey: 'employeeid'})
      }

    return project;
};
