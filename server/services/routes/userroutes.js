'use strict';
module.exports = function (app, upload) {
  const userController = require('../controllers/user.controller');
  const employeeController = require('../controllers/employee.controller');

  // employee Routes
  app.route('/user')
    .get(async(req, res, next) => {
        return userController.getAllUser(req, res, next);
    })
    .post(async(req, res, next) => {
      return userController.registerUser(req, res, next);
    })

  app.route('/loginuser')
    .get(async(req, res, next) => {
        return userController.loginUser(req, res, next);
    })
   
  app.route('/user/:id')
    .get(async(req, res, next) => {
      return userController.getUserByPk(req, res, next);
    })  

};  