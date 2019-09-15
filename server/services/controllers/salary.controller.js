const path = require("path");
const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// exports.employee_list = function (req, res) {
// 	fltr = req['fitler']
//     models.saempoyee.findAll().then((result) => {
//         return res.json(result);
//     });
// };

// to get employee salary
exports.getEmployeeSalary = function (req, res) {
	models.saemployee.findAll({
        include: [{model: models.sasalary,
                  as: 'sasalary',
                  where: {salaryamount: {[Op.gt]: 30000 } }
                }]
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
// exports.getEmployeeByPk = function (req, res) {
//     models.saemployee.findByPk(req.params.id,
//         {include: [{model: models.saproject,
//         as: 'saproject'}]})
//     .then(function(saemployee){
//         res.status(200).json(saemployee);
//     })
//     .catch(function(error){
//         res.status(500).json(error);
//     })
// };

