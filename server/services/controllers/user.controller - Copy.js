const path = require("path");
const models = require('../models');
var Promise = require('promise');
const crypto = require('crypto');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require('../auth/config');

module.exports = {
    getAllUser: async function(req, res, next) {
        try {
            var result = await getAllUserFromDB(req, res);
            res.status(200);
           
            console.log(JSON.stringify(result));
            return res.json(result);
        } catch(err) {
            res.status(500);
            return res.json(err.message + ' ' + err.name);
        }
    },

    getUserByPk: async function(req, res, next) {
        try {
            var result = await getUserByPkFromDB(req, res);
            console.log('getUserByPk result :' + result);
            res.status(200);
            return res.json(result);
        } catch(err) {
            res.status(500);
            return res.json(err);
        }
    },

    registerUser: async function(req, res, next) {
        try {
           console.log(req.body);
            var result = await addUserToDB(req, res);
            res.status(200);
            return res.json(result);
        } catch(err) {
            res.status(500);
            return res.json(err.message + ' ' + err.name);
        }
    },

    loginUser : async function(req, res, next) {
        console.log(' req.body.email : ' +  req.body.email);
        try {
            var result = await getLoggedInUserFromDB(req, res);
            console.log('user.password :' + result.password);
            // check if the password is valid
            var passwordIsValid = bcrypt.compareSync(req.body.password, result.password);
            console.log('passwordIsValid :' + passwordIsValid);
            if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

            // if user is found and password is valid
            // create a token
            console.log('result.id :' + result.id);
            var token = jwt.sign({ id: result.id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
            });
            console.log('token :' + token);
            // return the information including token as JSON
            res.status(200).send({ auth: true, token: token });
        } catch(err) {
            res.status(500);
            return res.json(err);
        }
    }
};

function validateUser( user) { 
    console.log('user1 :' + user);
    if(!user){
        console.log('user2 :' + user);
        res.status(404).send({});
    }else{
        console.log('user3 :' + user);
        let passwordFields = user.password.split('$');
        let salt = passwordFields;
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        if (hash === passwordFields[1]) {
            req.body = {
                userId: user.id,
                email: user.email,
                permissionLevel: user.permissionLevel,
                provider: 'email',
                name: user.firstName + ' ' + user.lastName,
            };
            console.log('next :' + next());
            return next();
        } else {
            return res.status(400).send({errors: ['Invalid email or password']});
        }
    }
}

function getLoggedInUserFromDB( req, res) { 
    return new Promise(function(resolve, reject) {

    result = models.user.findOne({ where:{ email: req.body.email }});
    
    console.log('result :' + JSON.stringify(result));

     resolve(result);
    });
}

// to get all user
function getAllUserFromDB(req, res) {
    return new Promise(function(resolve, reject) {
            result = models.user.findAll({where: {"email":"Sachin"}});
            console.log('result : ' + JSON.stringify(result));
            resolve(result);
    });
}

// get user by primery key
function getUserByPkFromDB(req, res) {
    return new Promise(function(resolve, reject) {
            let result = models.user.findByPk(req.params.id);
            resolve(result);
    })
}
// to add user
function addUserToDB(req, res) {
    return new Promise(function(resolve, reject) {
        // var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        // req.body.password = hashedPassword;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
        req.body.permissionLevel = 1;
        // req.body.permissionLevel = 1;
            console.log(models.user);
            let result = models.user.create(req.body);
            resolve(result);
    })
}
