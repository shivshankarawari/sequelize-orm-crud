const path = require("path");
const models = require('../models');
var Promise = require('promise');
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const filterOrder = require('./filterOrderUtils');

module.exports = {
    getAllEmployee: async function(req, res, next) {
        try {
            //Assuming that below fields are passed from UI : tableName, ui_filters,order_filters and operation_type
            var tableName = 'employee';
            var ui_filters = [
                {'column':'firstName','value' : 'Sachin','comparison':'eq'},
                {'column':'designation','value' : 'Crick','comparison':'like'},
                {'column':'age','value' : '30','comparison':'gt'}
            ];
            var order_filters = [
                {"column": "firstName", "order": "ASC"}, 
                {"column": "designation", "order": "ASC"}
            ];
            operation_type = 'and';

            fltr_list = filterOrder.getFilterCriteria(ui_filters);
            order_list = filterOrder.getOrderCriteria(order_filters);
            
            if(operation_type == 'and') {
                var fltr_obj = {
                    // where: { [Op.and]:fltr_list }, order: [['firstName', 'ASC'],['designation', 'ASC']]
                    where: { [Op.and]:fltr_list }, order: order_list
                }
            } else if(operation_type == 'or') {
                var fltr_obj = {
                    // where: { [Op.and]:fltr_list }, order: [['firstName', 'ASC'],['designation', 'ASC']]
                    where: { [Op.or]:fltr_list }, order: order_list
                }
            }   
            var result = await getAllEmployeeFromDB(req, res, tableName, fltr_obj);
            res.status(200);
            return res.json({status: "success", message: "Employee Found!!!", employee: result});
        } catch(err) {
            res.status(500);
            return res.json(err.message + ' ' + err.name);
        }
    },

    getEmployeeByPk: async function(req, res, next) {
        try {
            var tableName = 'employee';
            var result = await getEmployeeByPkFromDB(req, res, tableName);
            console.log('getEmployeeByPk result :' + result);
            res.status(200);
            return res.json({status: "success", message: "Employee found!!!", employee: result});
        } catch(err) {
            res.status(500);
            return res.json(err);
        }
    },

    addEmployee: async function(req, res, next) {
        try {
            var tableName = 'employee';
            console.log(req.body);
            var result = await addEmployeeToDB(req, res, tableName);
            res.status(200);
            return res.json({status: "success", message: "Employee added successfully!!!", employee: result});
        } catch(err) {
            res.status(500);
            return res.json(err.message + ' ' + err.name);
        }
    },

    updateEmployee: async function(req, res, next) {
        try {
            var tableName = 'employee';
            var result = await udpateEmployeeToDB(req, res, tableName);
            res.status(200);
            return res.json({status: "success", message: "Employee updated successfully!!!", user: result});
        } catch(err) {
            res.status(500);
            return res.json(err);
        }
    },

    deleteEmployee: async function(req, res, next) {
        try {
            var tableName = 'employee';
            var result = await deleteEmployeeFromDB(req, res, tableName);
            res.status(200);
            return res.json({status: "success", message: "Employee deleted successfully!!!"});
        } catch (err) {
            res.status(500);
            return res.json(err);
        }
    }
};

// to get all employee
function getAllEmployeeFromDB(req, res, tableName, fltr_obj) {
    return new Promise(function(resolve, reject) {
        result = filterOrder.getModel(tableName).findAll({include: [{model: models.address,
                                            as: 'address'}],fltr_obj});
            // result = models.employee.findAll({include: [{model: models.address,
            //                                 as: 'address'}],
            //                                 where: filterCriteria,
            //                                 order: [['firstName', 'ASC']]});
            // {
            // result = models.employee.findAll({where: { [Op.and]: [ { firstName: { [Op.eq]: 'Sachin'} },{ lastName: { [Op.eq]: 'Tendulkar'} } ] },
            //                                     order: [['firstName', 'ASC']]});
            // result = models.employee.findAll({where: {"firstName":"Sachin","lastName":"Tendulkar"}});

            resolve(result);
    });
}

// // to get all employee
// function getAllEmployeeFromDB(req, res) {
//     return new Promise(function(resolve, reject) {
//             result = models.employee.findAll({
//                 include: [{model: models.project,
//                             as: 'project'}]
//             });
//             resolve(result);
//     });
// }

// get employee by primery key
function getEmployeeByPkFromDB(req, res, tableName) {
    return new Promise(function(resolve, reject) {
            let result = filterOrder.getModel(tableName).findByPk(req.params.id);
            resolve(result);
    })
}

// get employee by primery key
// function getEmployeeByPkFromDB(req, res) {
//     return new Promise(function(resolve, reject) {
//         setTimeout(() => {
//             let result = models.employee.findByPk(req.params.id,
//                 {include: [{model: models.project,
//                             as: 'project'}]
//                 });
//             resolve(result);
//         }, 2000);
//     })
// }

// to add employee
function addEmployeeToDB(req, res, tableName) {
    return new Promise(function(resolve, reject) {
            let result = filterOrder.getModel(tableName).create(req.body);
            resolve(result);
    })
}

// to add employee
// function addEmployeeToDB(req, res) {
//     return new Promise(function(resolve, reject) {
//         setTimeout(() => {
//             console.log(models.employee);
//             let result = models.employee.create(req.body, {
//                 include: [{model: models.project,
//                     as: 'project'}, {model: models.address,
//                         as: 'address'}]
//               })
//             resolve(result);
//         }, 2000);
//     })
// }

// upadate an employee in DB
function udpateEmployeeToDB(req, res, tableName) {
    return new Promise(function(resolve, reject) {
            let result = filterOrder.getModel(tableName).update(req.body,
                    { where: {
                            id: req.params.id
                        }
                    })
            resolve(result);
    })
}

// upadate an employee in DB
// function udpateEmployeeToDB(req, res) {
//     return new Promise(function(resolve, reject) {
//         setTimeout(() => {
            
//             const employeetoUpdate = {
//                 firstname: req.body.firstname,
//                 lastname: req.body.lastname
//             }

//             let result = models.employee.update(employeetoUpdate,
//                     { where: {
//                             id: req.params.id
//                         }
//                     })
//             resolve(result);
//         }, 2000);

//         setTimeout(() => {
            
//             const projecttoUpdate = {
//                 projectname: req.body.project[0].projectname
//             }

//             let result1 = models.project.update(projecttoUpdate,
//                 { where: {
//                         employeeid: req.params.id
//                     }
//                 })
//             resolve(result1);
//         }, 2000);
//     })
// }

// to delete an employee
function deleteEmployeeFromDB(req, res, tableName) {
    return new Promise(function(resolve, reject) {
            let result = filterOrder.getModel(tableName).destroy({
                where: { id: req.params.id }
            });
            resolve(result);
    })
}
