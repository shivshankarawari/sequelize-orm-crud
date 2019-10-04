const path = require("path");
// var querystring = require('querystring');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    // getFilterCriteria : function () {
    //     var filterMap = new Map(); 
    //     filterMap.set('firstName', 'Sachin');
    //     filterMap.set('lastName', 'Tendulkar');
    
    //     // const parsed  = querystring.parse('firstName=Virat&lastName=Tendulkar');
    //     // console.log('parsed  :' + parsed );
    
    //     var filterCriteria='{ [Op.and]: [ ';
    //     function buildFilterCriteria(values, key, map) {
    //     // filterCriteria = filterCriteria + key + ':\'' + values + '\' AND ';
    //     filterCriteria = filterCriteria + '{ ' + key + ': { [Op.eq]: \'' + values + '\'} },';
    //     }
    //     filterMap.forEach(buildFilterCriteria);
    
    //     var filterCriteriaStr = filterCriteria.substring(0, filterCriteria.length - 1).concat(' ] } }');;
    //     console.log('filter Criteria:' + filterCriteriaStr);
    //     //return { [Op.and]: [ { firstName: { [Op.eq]: 'Sachin'} },{ lastName: { [Op.eq]: 'Tendulkar'} } ] }
    //     return filterCriteriaStr;
    // },

        
// getFilterCriteria : function () {
//     var filterObj = [
//         {"colkey": "firstName","comparison": "or","value": "Sachin"}, 
//         {"colkey": "lastName","comparison": "or","value": "Awari"}
//     ];

//     filterCriteria = {};
//     var operator;
//     filterObj.forEach(function(item){
//         if(item.comparison == 'and') {
//             console.log('Key: ' + item.colkey);
//             console.log('Comparision: ' + item.comparison);
//             console.log('value: ' + item.value);
//             operator = 'and';
//             filterCriteria[item.colkey] =  item.value;
//             console.log('filterCriteria :' + JSON.stringify(filterCriteria));
//             // return {[Op.and]: filterCriteria};
//         } else if(item.comparison == 'or') {
//             operator = 'or';
//             filterCriteria[item.colkey] =  item.value;
//             console.log('filterCriteria :' + JSON.stringify(filterCriteria));
//             // return {[Op.or]: filterCriteria};
//         }        
//     });
//     if(operator == 'and') {
//         return {[Op.and]: filterCriteria};
//     } else if(operator == 'or') {
//         return {[Op.or]: filterCriteria};
//     }
// },

getFilterCriteria: function(ui_filters) {
    var fltr_list = [ ] 
    for(var i = 0; i < ui_filters.length;i++){
        var obj = getFilterObj(ui_filters[i]);
        fltr_list.push(obj);
    }
    return fltr_list;
},

getOrderCriteria : function(order_filters) {
    var order_list = [ ] 
    for(var i = 0; i < order_filters.length;i++){
        var obj = getOrderObj(order_filters[i]);
        order_list.push(obj);
    }
    return order_list;
}
};

function getOrderObj(order_filter) {
    var order_obj;

    var col = order_filter['column']
    var order_type = order_filter['order']

    order_obj = [col, order_type];
    return order_obj;
    // op_obj = {  [col] : { [op_obj] : fltr_value } }
}
// function getFilterOperator(op_type, fltr_value) {
//     var op_obj1;

//     console.log('op_type :' + op_type);
//     switch(op_type) {
//         case 'and' :
// 			op_obj1 = Op.and;	 // AND (a = 5)
// 		case 'or' :
// 			op_obj1 = Op.or;		 // (a = 5 OR a = 6)
// 		case 'gt' :
// 			op_obj1 = Op.gt;		 // > 6
// 		case 'gte' :
// 			op_obj1 = Op.gte;	 // >= 6
// 		case 'lt' :
// 			op_obj1 = Op.lt;		 // < 10
// 		case 'lte' :
// 			op_obj1 = Op.lte;	 // <= 10
// 		case 'ne' :
// 				op_obj1 = Op.ne;	 // != 20
// 		case 'eq' :
//                 console.log('op_type :' + op_type);
//                 op_obj1 = Op.eq;
//                 console.log('op_obj1 :' + op_obj1);
// 		case 'is' :
// 				op_obj1 = Op.is;	 // IS NULL
// 		case 'not' :
// 				op_obj1 = Op.not; // IS NOT TRUE
// 		case 'between' :
// 				op_obj1 = Op.between; // BETWEEN 6 AND 10
// 		case 'notBetween' :
// 				op_obj1 = Op.notBetween;	// NOT BETWEEN 11 AND 15
// 		case 'in' :
// 				op_obj1 = Op.in;	// IN [1, 2]
// 		case 'notIn' :
// 				op_obj1 = Op.notIn;	// NOT IN [1, 2]
// 		case 'like' :
//                 op_obj1 = Op.like;	// LIKE '%hat'
//                 console.log('op_obj1 :' + op_obj1);
// 		case 'notLike' :
// 				op_obj1 = Op.notLike; // NOT LIKE '%hat'
// 		case 'iLike' :
// 				op_obj1 = Op.iLike;	// ILIKE '%hat' (case insensitive) (PG only)
// 		case 'notILike' :
// 				op_obj1 = Op.notILike; // NOT ILIKE '%hat'  (PG only)
// 		case 'startsWith' :
// 				op_obj1 = Op.startsWith;	// LIKE 'hat%'
// 		case 'endsWith' :
// 				op_obj1 = Op.endsWith; // LIKE '%hat'
// 		case 'substring' :
// 				op_obj1 = Op.substring;	// LIKE '%hat%'
// 		case 'regexp' :
// 				op_obj1 = Op.regexp;	// REGEXP/~ '^[h|a|t]' (MySQL/PG only)
// 		case 'notRegexp' :
// 				op_obj1 = Op.notRegexp;	// NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
// 		case 'iRegexp' :
// 				op_obj1 = Op.iRegexp;	// ~* '^[h|a|t]' (PG only)
// 		case 'notIRegexp' :
// 				op_obj1 = Op.notIRegexp;	// !~* '^[h|a|t]' (PG only)
// 		case 'any' :
// 				op_obj1 = Op.any;  // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
// 		case 'overlap' :
// 				op_obj1 = Op.overlap;   // && [1, 2] (PG array overlap operator)
// 		case 'contains' :
// 				op_obj1 = Op.contains;  // @> [1, 2] (PG array contains operator)
// 		case 'contained' :
// 				op_obj1 = Op.contained;	// <@ [1, 2] (PG array contained by operator)
// 		case 'col' :
// 				op_obj1 = Op.col;	// = "user"."organization_id", with dialect specific column identifiers, PG in this example
// 		case 'all' :
// 				op_obj1 = Op.all;	// > ALL (SELECT 1)        
//     }
//     return op_obj1;
// }

function getFilterObj(ui_filter) {
    var op_obj;
    var op_obj1;
    var col = ui_filter['column']
    var op_type = ui_filter['comparison']
    var fltr_value = ui_filter['value']
    
    console.log('op_type :' + op_type);
    if (op_type == 'and') 
            op_obj = Op.and;	 // AND (a = 5)
        else if (op_type == 'or') 
            op_obj = Op.or;		 // (a = 5 OR a = 6)
        else if (op_type == 'gt') 
            op_obj = Op.gt;		 // > 6
        else if (op_type == 'gte') 
            op_obj = Op.gte;	 // >= 6
        else if (op_type == 'lt') 
            op_obj = Op.lt;		 // < 10
        else if (op_type == 'lte') 
            op_obj = Op.lte;	 // <= 10
        else if (op_type == 'ne') 
            op_obj = Op.ne;	 // != 20
        else if (op_type == 'eq') 
            op_obj = Op.eq;	 // = 3
        else if (op_type == 'is') 
            op_obj = Op.is;	 // IS NULL
        else if (op_type == 'not') 
            op_obj = Op.not; // IS NOT TRUE
        else if (op_type == 'between') 
            op_obj = Op.between; // BETWEEN 6 AND 10
        else if (op_type == 'notBetween') 
            op_obj = Op.notBetween;	// NOT BETWEEN 11 AND 15
        else if (op_type == 'in') 
            op_obj = Op.in;	// IN [1, 2]
        else if (op_type == 'notIn') 
            op_obj = Op.notIn;	// NOT IN [1, 2]
        else if (op_type == 'like') {
            op_obj = Op.like;	// LIKE '%hat'
            fltr_value = '%' + fltr_value + '%'
        }
        else if (op_type == 'notLike') 
            op_obj = Op.notLike; // NOT LIKE '%hat'
        else if (op_type == 'iLike') 
            op_obj = Op.iLike;	// ILIKE '%hat' (case insensitive) (PG only)
        else if (op_type == 'notILike') 
            op_obj = Op.notILike; // NOT ILIKE '%hat'  (PG only)
        else if (op_type == 'startsWith') 
            op_obj = Op.startsWith;	// LIKE 'hat%'
        else if (op_type == 'endsWith') 
            op_obj = Op.endsWith; // LIKE '%hat'
        else if (op_type == 'substring') 
            op_obj = Op.substring;	// LIKE '%hat%'
        else if (op_type == 'regexp') 
            op_obj = Op.regexp;	// REGEXP/~ '^[h|a|t]' (MySQL/PG only)
        else if (op_type == 'regexp') 
            op_obj = Op.notRegexp;	// NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
        else if (op_type == 'iRegexp')
            op_obj = Op.iRegexp;	// ~* '^[h|a|t]' (PG only)
        else if (op_type == 'notIRegexp')
            op_obj = Op.notIRegexp;	// !~* '^[h|a|t]' (PG only)
        else if (op_type == 'any')
            op_obj = Op.any;  // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
        else if (op_type == 'overlap')
            op_obj = Op.overlap;   // && [1, 2] (PG array overlap operator)
        else if (op_type == 'contains')
            op_obj = Op.contains;  // @> [1, 2] (PG array contains operator)
        else if (op_type == 'contained')
            op_obj = Op.contained;	// <@ [1, 2] (PG array contained by operator)
        else if (op_type == 'col')
            op_obj = Op.col;	// = "user"."organization_id", with dialect specific column identifiers, PG in this example
        else if (op_type == 'all')
            op_obj = Op.all;	// > ALL (SELECT 1)
    
        op_obj = {  [col] : { [op_obj] : fltr_value } }
        return op_obj
}
function comparisionOperation(comparison, value) {
    if(comparison == 'like') {
        return '[Op.eq]';
    }
}