/* 
 * ORM
 */

var orm = {};

orm.objectType = function(objectType){
    return {
        type : objectType,
        filters : [],
        filterBy: function(field, value){
           
        }
    };
}


module.exports = orm;