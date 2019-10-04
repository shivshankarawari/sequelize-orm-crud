const path = require("path");
const models = require('../models');
var Promise = require('promise');
const crypto = require('crypto');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require('../auth/config');
const jwtSecret = require('../auth/config').jwt_secret;

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
            return res.json({status: "success", message: "User added successfully!!!", user: result});
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

            isPasswordAndUserMatch(req, res, result);
            // check if the password is valid
            console.log('req.body.password : ' + req.body.password);
            // var passwordIsValid = bcrypt.compareSync(req.body.password, result.password);
            // console.log('passwordIsValid :' + passwordIsValid);

            let refreshId = req.body.id + jwtSecret;
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            console.log('hash 1:' + hash);
            console.log('Salt 1:' + salt);
            let token = jwt.sign(req.body, jwtSecret);
            console.log('token:' + token);
            let b = new Buffer(hash);
            let refresh_token = b.toString('base64');
            res.status(201).send({status:"success", message: "user found!!!", data:{user: result, accessToken: token, refreshToken: refresh_token}});
        } catch(err) {
            res.status(500).send({errors: err});
        }
    }
};

function isPasswordAndUserMatch(req, res, user) { 
    console.log('user1 :' + user);
    if(!user){
        console.log('user2 :' + user);
        res.status(404).send({});
    }else{
        console.log('password :' + user.password);
        let passwordFields = user.password.split('$');
        console.log('passwordFields0 :' + passwordFields[0]);
        console.log('passwordFields1 :' + passwordFields[1]);
        let salt = passwordFields[0];
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        console.log('hash :' + hash);
        
        if (hash === passwordFields[1]) {
            console.log('in hash :' + hash);
            req.body = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                permissionLevel: user.permissionLevel                
            };
            console.log('next :');
            return;
        } else {
            console.log('Else block :' + erros);
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
