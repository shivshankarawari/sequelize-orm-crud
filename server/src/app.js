/**
 * Module dependencies.
 */
var express = require('express');
var request = require('request');
var path = require('path');
var httpProxy = require('http-proxy');
var http = require('http');
var bodyParser = require('body-parser');
var devConfig = require('../config/localConfig.json')['development'];
var models = require('../services/models');
const multer = require("multer");
var expressValidator = require('express-validator');

// Node express server setup.
var server = express();
var appRouter = express.Router();
var urlKey = {};

var apiForwardingUrl = devConfig.microServiceURLocal;

var proxyOptions = {
  changeOrigin: true,
  target: {
    https: true
  }
};

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Content-Length, X-Requested-With, Origin, Accept');

  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
};

httpProxy.prototype.onError = function (err) {
  console.log(err);
};

var apiProxy = httpProxy.createProxyServer(proxyOptions);

console.log('Forwarding API requests to ' + apiForwardingUrl);

server.set('port', process.env.PORT || 5000);
server.use(express.static(path.join(__dirname, '../public')));
server.use(allowCrossDomain);

// parse application/json
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: false
}));
// server.use(expressValidator());

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/uploads/'),
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).single('file');

const employeeRoutes = require('../services/routes/employeeroutes.js')(server, upload);
const addressRoutes = require('../services/routes/addressroutes')(server, upload);
const userRoutes = require('../services/routes/userroutes')(server, upload);

// appRouter.use('/employee', employeeRoutes);
// appRouter.use('/employeeaddress', addressRoutes);

// validate auth token here.
server.use(function (req, res, next) {
  console.log('implement auth token validation.');
  next();
});

server.get("/apis/*", function (req, res) {
  req.headers['X-Access-Token'] = req.headers.token;
  req.url = req.url.replace('/apis/', '');
  apiProxy.web(req, res, { target: apiForwardingUrl });
});

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

server.post("/apipost/*", function (req, res) {
  req.headers['X-Access-Token'] = req.headers.token;
  req.url = req.url.replace('/apipost/', '');
  apiProxy.web(req, res, { target: apiForwardingUrl });
});

server.get('/favicon.ico', function (req, res) {
  res.send('favicon.ico');
});

models.sequelize.sync({ force: false }).then(function () {
  // Start Server.
  server.listen(server.get('port'), function () {
    console.log('Express server listening on port ' + server.get('port'));
  });
});

// // Start Server.
// server.listen(server.get('port'), function () {
//   console.log('Express server listening on port ' + server.get('port'));
// });

