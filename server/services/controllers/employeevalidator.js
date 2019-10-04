const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
    case 'addEmployee': {
     return [ 
        body('firstname', 'firstname doesn\'t exists').exists(),
        body('lastname', 'last doesn\'t exists').exists(),
       ]   
    }
  }
}