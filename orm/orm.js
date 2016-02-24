var orm = {};

orm.init = function(db, db_pool, schema){
    orm.db = db;
    orm.db_pool = db_pool;
    orm.schema = schema;
};

orm.query = function(model){
    var obj = new (require('./models/'+model+'_query'))();
    obj.init(orm.db, orm.db_pool);
    return obj;
};

orm.make = function(model){
    var obj = new (require('./models/'+model))();
    obj.init(orm.db, orm.db_pool);
    obj.setNew(true);
    return obj;
};

orm.adhoc = function(sql, cb){
    this.db_pool.getConnection( function ( err, con ){
        // check for any connection errors
        if( err ){
            console.log('error at connaction: ');
            console.log(err);
            cb(err);
        }else{
            // connected
            console.log(sql);
            con.query(
                sql,
                function ( err, rows, fields ){
                    if( err ){
                        console.log('error at execute: ');
                        console.log(err);
                        cb(err);
                    }else{
                        cb(null, rows);
                    }
                }
            );
            con.release();
        }
    });
};

module.exports = orm;

/*
 * 
View generàlàs
http://stackoverflow.com/questions/201621/how-do-i-see-all-foreign-keys-to-a-table-or-column
http://stackoverflow.com/questions/12352048/mysql-create-view-joining-two-tables

Indexek felépítése
http://stackoverflow.com/questions/5213339/how-to-see-indexes-for-a-database-or-table

Client side version
// ajax client?

Setterek adatbàzis formàra / Getterek adatbàzisról kód formàra

Validation.js

Access rights

next() pre() for query (onset and limit manipulation 
 * 
 */