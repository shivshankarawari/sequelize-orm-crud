'use strict';
module.exports = function (app, upload) {
  const employeeController = require('../controllers/employee.controller');
  const salaryController = require('../controllers/salary.controller');

  app.all('/employees/:gid', upload, function (req, res, next) { next() });

  // employee Routes
  app.route('/employees')
    .get(employeeController.getAllEmployee)
    .post(employeeController.addEmployee);

  app.route('/employees/:id')
    .get(employeeController.getEmployeeByPk)
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee);

   // employee Routes
   app.route('/employeesalary')
   .get(salaryController.getEmployeeSalary);
};  