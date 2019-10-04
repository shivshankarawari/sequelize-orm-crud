'use strict';
module.exports = function (app, upload) {
  const employeeController = require('../controllers/employee.controller');
  const addressController = require('../controllers/address.controller');
  const employeeValidatorController = require('../controllers/employeevalidator');

  app.all('/employee/:gid', upload, function (req, res, next) { next() });

  // employee Routes
  app.route('/employee')
    .get(async(req, res, next) => {
        return employeeController.getAllEmployee(req, res, next);
    })
    .post(async(req, res, next) => {
      return employeeController.addEmployee(req, res, next);
    })

  app.route('/employee/:id')
    .get(async(req, res, next) => {
      return employeeController.getEmployeeByPk(req, res, next);
    })
    .put(async(req, res, next) => {
      return employeeController.updateEmployee(req, res, next);
    })
    .delete(async(req, res, next) => {
      return employeeController.deleteEmployee(req, res, next);
    })
  

};  