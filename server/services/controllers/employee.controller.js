const path = require("path");
const models = require('../models');

// exports.employee_list = function (req, res) {
// 	fltr = req['fitler']
//     models.saempoyee.findAll().then((result) => {
//         return res.json(result);
//     });
// };

// to get all employee
exports.getAllEmployee = function (req, res) {
	models.saemployee.findAll({
        include: [{model: models.saproject,
                  as: 'saproject'}]
	}).then(saemployee => {
		if (saemployee && Object.keys(saemployee).length > 0)
			res.json({ success: true, saemployee });
		else
			res.status(400).json({ success: false, error: "No Employee found." });
	})
};

// to get one employee
// exports.get_employee = function (req, res) {
// 	models.saemployee.findOne({where: {
//         id: req.params.id
//     }},{
//         include: [models.saproject],
//         order: [['projectname', 'DESC']]
// 	}).then(saemployee => {
// 		if (saemployee && Object.keys(saemployee).length > 0)
// 			res.json({ success: true, saemployee });
// 		else
// 			res.status(400).json({ success: false, error: "No Employee found." });
// 	})
// };

// to get an employee by primary key
exports.getEmployeeByPk = function (req, res) {
    models.saemployee.findByPk(req.params.id,
        {include: [{model: models.saproject,
        as: 'saproject'}]})
    .then(function(saemployee){
        res.status(200).json(saemployee);
    })
    .catch(function(error){
        res.status(500).json(error);
    })
};

// to add an employee
exports.addEmployee = function(req, res) {
    var project = models.saproject.build();
    console.log(req.body.saproject[0]);
    console.log(req.body.saproject[0].projectname);
    console.log(req.body.saproject[0].employeeid);
    project.projectname=req.body.saproject[0].projectname;
    // project.employeeid=req.body.saproject[0].employeeid;

    var employee = models.saemployee.build();
    employee.firstname=req.body.firstname;
    employee.lastname=req.body.lastname;
    employee.save()
    .then(function(saemployee){
        console.log(saemployee.id);
        project.employeeid=saemployee.id;
        project.save();
        res.status(200).json('Employee added successfuly');
    })
    .catch(function(error){
        res.status(500).json(error);
    })
};

// to update an employee
exports.updateEmployee = function(req, res) {

    models.saemployee.findOne({where: {
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
    models.saemployee.destroy({
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
