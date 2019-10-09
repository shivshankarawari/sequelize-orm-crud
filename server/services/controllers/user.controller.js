const path = require("path");
const models = require('../models');
var Promise = require('promise');
const crypto = require('crypto');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require('../auth/config');
const jwtSecret = require('../auth/config').jwt_secret;
const jwt_expiration_in_seconds = require('../auth/config').jwt_expiration_in_seconds;

module.exports = {
    getAllUser: async function(req, res, next) {
        try {
            var tableName = 'user';
            var result = await getAllUserFromDB(req, res, tableName);
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
            var tableName = 'user';
            var result = await getUserByPkFromDB(req, res, tableName);
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
            var tableName = 'user';
            var result = await addUserToDB(req, res, tableName);
            res.status(200);
            return res.json({status: "success", message: "User added successfully!!!", user: result});
        } catch(err) {
            res.status(500);
            return res.json(err.message + ' ' + err.name);
        }
    },

    loginUser : async function(req, res, next, tableName) {
        console.log(' req.body.email : ' +  req.body.email);
        try {
            // get user details from DB
            var result = await getLoggedInUserFromDB(req, res, tableName);
            // check if the password is valid
            isPasswordAndUserMatch(req, res, result);
            let refreshId = req.body.id + jwtSecret;
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
            req.body.refreshKey = salt;
            console.log('hash 1:' + hash);
            console.log('Salt 1:' + salt);
            let token = jwt.sign(req.body, jwtSecret);
            console.log('token:' + token);
            // set the cookie as the token string, with a similar max age as the token
            // here, the max age is in milliseconds, so we multiply by 1000
            res.cookie('accessToken', token, { maxAge: jwt_expiration_in_seconds })
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

    function getLoggedInUserFromDB( req, res, tableName) { 
        return new Promise(function(resolve, reject) {

        result = models.user.findOne({ where:{ email: req.body.email }});    
        console.log('result :' + JSON.stringify(result));

        resolve(result);
        });
    }

    // to get all user
    function getAllUserFromDB(req, res, tableName) {
        return new Promise(function(resolve, reject) {
                result = filterOrder.getModel(tableName).findAll({where: {"email":"Sachin"}});
                console.log('result : ' + JSON.stringify(result));
                resolve(result);
        });
    }

    // get user by primery key
    function getUserByPkFromDB(req, res, tableName) {
        return new Promise(function(resolve, reject) {
                let result = filterOrder.getModel(tableName).findByPk(req.params.id);
                resolve(result);
        })
    }

    // to add user
    function addUserToDB(req, res, tableName) {
        return new Promise(function(resolve, reject) {
            // var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            // req.body.password = hashedPassword;
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            req.body.password = salt + "$" + hash;
            req.body.permissionLevel = 1;
            // req.body.permissionLevel = 1;
            let result = filterOrder.getModel(tableName).create(req.body);
            resolve(result);
        })
    }
