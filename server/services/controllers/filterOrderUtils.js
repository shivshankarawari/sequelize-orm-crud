const path = require("path");
// var querystring = require('querystring');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {  

    getOperationType: function(ui_filters) {
        var operation_type
        for(var i = 0; i < ui_filters.length;i++){
            ui_filter = ui_filters[i];
            operation_type = ui_filter['comparison'];
        }
        return operation_type;
    },

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

function getOrderObj(order_filter) {
    var order_obj;

    var col = order_filter['column']
    var order_type = order_filter['order']

    order_obj = [col, order_type];
    return order_obj;
}
