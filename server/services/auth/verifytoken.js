
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
jwt_secret =  require('./config').jwt_secret,
crypto = require('crypto');

function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.headers['x-access-token'];
  console.log('token :' + token);
  // var token = req.cookies.accessToken;
  if (!token) 
    return res.status(403).send({ auth: false, message: 'No token provided.' });
    
  // verifies secret and checks exp
  jwt.verify(token, config.jwt_secret, function(err, decoded) {      
    if (err) 
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });

}

module.exports = verifyToken;