const path = require("path");
const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
	getEmployeeAddress : async function(req, res, next) {
		try {
			var result = await getEmployeeAddressFromDB(req, res);
			res.status(200)
			return res.json(result)
		} catch(err) {
			res.status(500)
			return res.json(err)
		}
	},

	getAddressDetails : async function(req, res, next) {
		try {
			var result = await getAddressDetailsFromDB(req, res);
			res.status(200)
			return res.json(result)
		} catch(err) {
			res.status(500)
			return res.json(err)
		}
	},

	addEmployeeAddress : async function(req, res, next) {
		try {
			console.log('id : ' + req.params.id );
			var result = await addEmployeeAddressToDB(req, res);
			res.status(200);
			return res.json(result);
		} catch(err) {
			res.status(500);
			return res.json(err.message);
		}
	}
};

function getEmployeeAddressFromDB(req, res) {
	return new Promise(function(resolve, reject){
		setTimeout(() => {
			result = models.employee.findAll({
				include: [{model: models.address,
						  as: 'address'} ]
			});
			resolve(result);
		}, 2000);
	});
}

function getAddressDetailsFromDB(req, res) {
	return new Promise(function(resolve, reject){
		setTimeout(() => {
			result = models.employee.findOne({
				include: [{model: models.address,
						  as: 'address'}],
				where: {id: req.params.id}
			});
			resolve(result);
		}, 2000);
	});
}

function addEmployeeAddressToDB(req, res) {
	return new Promise(function(resolve, reject) {
		setTimeout(() => {
			var address = models.address.build();
			// address.id = req.body.id;
			console.log('id1 : ' + req.params.id );
			address.addressType = req.body.addressType
			address.firstLine = req.body.firstLine;
			address.city = req.body.city;
			address.state = req.body.state;
			address.country = req.body.country;
			address.employeeid = req.body.employeeid;	
			let result = models.address.create(req.body);
			resolve(result);
		}, 2000);
	});
}


		
	

// to get employee address

// exports.getEmployeeaddressFromDB = function (req, res) {
// 	models.saemployee.findAll({
//         include: [{model: models.address,
//                   as: 'address',
//                   where: {addressamount: {[Op.gt]: 30000 } }
//                 }]
// 	}).then(saemployee => {
// 		if (saemployee && Object.keys(saemployee).length > 0)
// 			res.json({ success: true, saemployee });
// 		else
// 			res.status(400).json({ success: false, error: "No Employee found." });
// 	})
// };

