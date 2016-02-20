var orm = {};

orm.init = function(db, db_pool, schema){
    orm.db = db;
    orm.db_pool = db_pool;
    orm.schema = schema;
};

orm.query = function(model){
    var obj = new (require('./models/base/'+model+'_query'))();
    obj.init(orm.db, orm.db_pool);
    return obj;
};

orm.make = function(model){
    var obj = new (require('./models/base/'+model))();
    obj.init(orm.db, orm.db_pool);
    obj.setNew(true);
    return obj;
};

module.exports = orm;