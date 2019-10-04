const path = require("path");
const models = require('../models');
var Promise = require('promise');

// to get all employee
exports.getAllEmployee = function (req, res) {
	models.employee.findAll({
        include: [{model: models.project,
                  as: 'project'}]
	}).then(employee => {
		if (employee && Object.keys(employee).length > 0)
			res.json({ success: true, employee });
		else
			res.status(400).json({ success: false, error: "No Employee found." });
	})
};

// to get one employee
// exports.get_employee = function (req, res) {
// 	models.employee.findOne({where: {
//         id: req.params.id
//     }},{
//         include: [models.project],
//         order: [['projectname', 'DESC']]
// 	}).then(employee => {
// 		if (employee && Object.keys(employee).length > 0)
// 			res.json({ success: true, employee });
// 		else
// 			res.status(400).json({ success: false, error: "No Employee found." });
// 	})
// };

// to get an employee by primary key
exports.getEmployeeByPk = function (req, res) {
    models.employee.findByPk(req.params.id,
        {include: [{model: models.project,
        as: 'project'}]})
    .then(function(employee){
        res.status(200).json(employee);
    })
    .catch(function(error){
        res.status(500).json(error);
    })
};

// to add an employee
exports.addEmployee = function(req, res) {
    var project = models.project.build();
    console.log(req.body.project[0]);
    console.log(req.body.project[0].projectname);
    console.log(req.body.project[0].employeeid);
    project.projectname=req.body.project[0].projectname;
    // project.employeeid=req.body.project[0].employeeid;

    var employee = models.employee.build();
    employee.firstname=req.body.firstname;
    employee.lastname=req.body.lastname;
    employee.save()
    .then(function(employee){
        console.log(employee.id);
        project.employeeid=employee.id;
        project.save();
        res.status(200).json('Employee added successfuly');
    })
    .catch(function(error){
        res.status(500).json(error);
    })
};

// to update an employee
exports.updateEmployee = function(req, res) {

    models.employee.findOne({where: {
        id: req.params.id
    }}).then(function(employeeToUpdate){
        employeeToUpdate.firstname=req.body.firstname;
        employeeToUpdate.lastname=req.body.lastname;
        employeeToUpdate.save()
        .then(function(employeeToUpdate){
            res.status(200).json('Employee updated successfuly');
        })
        .catch(function(error){
            res.status(500).json(error);
        })
    })
};

// to delete an employee
exports.deleteEmployee = function (req, res) {
    models.employee.destroy({
        where: { 
            id: req.params.id
        }
    })
    .then(function(deletedEmployee) {
        res.status(200).json('Employee deleted successfuly');
    })
    .catch(function(error) {
        res.status(500).json(error);
    })
};
