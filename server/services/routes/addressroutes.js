'use strict';
module.exports = function (app, upload) {
  const employeeController = require('../controllers/employee.controller');
  const addressController = require('../controllers/address.controller');
  const employeeValidatorController = require('../controllers/employeevalidator');
  var VerifyToken = require('../auth/verifytoken');

   // employee Routes
   app.route('/employeeaddress')
   .get(VerifyToken, async(req, res, next) => {
     return addressController.getEmployeeAddress(req, res, next);
   })
   .post(async(req, res, next) => {
     return addressController.addEmployeeAddress(req, res, next);
   })
   // employee Routes
   app.route('/employeeaddress/:id')
   .get(async(req, res, next) => {
     return addressController.getAddressDetails(req, res, next);
   })

};  