const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/dbConfig.json')[env];
const Op = Sequelize.Op;

const operatorsAliases = {
  $eq: [Op.eq],
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

let db = {};
let sequelize = new Sequelize(config.database, config.username, config.password, config, { operatorsAliases });

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