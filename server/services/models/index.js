const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/dbConfig.json')[env];

let db = {};
let sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
    .readdirSync(__dirname)
    .filter(file => (file.indexOf(".") !== 0) && (file !== 'index.js'))
    .forEach(file => {
        let model = sequelize.import(path.join(__dirname, file));

        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
console.log(db);
db.sequelize = sequelize;
db.Sequelize = Sequelize;
//Associations
//Employee
// db.EMPLOYEE_DEMO.hasMany(db.PROJECT_DEMO);

//Projects
// db.PROJECT_DEMO.belongsTo(db.EMPLOYEE_DEMO);

module.exports = db;