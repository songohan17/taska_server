function query() {
    this.orderByList = []; 
    
    this.offset = false;
    this.limit = false;
    
    
    
    this.init = function(db, db_pool){
        this.db = db;
        this.db_pool = db_pool;
    };
    
    this.getFieldlistStr = function(){
        return '`'+this.fields.join("`, `")+'`';
    };
    
    this.where = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({ where : v });

        this.handleOrEnclose();

        return this;
    };

    this.handleContinuousFiltering = function(){
        if(this.criterias.length > 0){
            if(this.criterias[this.criterias.length-1].special === undefined){
                this.criterias.push({ special: 'AND' });
            }
            else{
                switch(this.criterias[this.criterias.length-1].special){
                    case ")": this.criterias.push({ special: 'AND' }); break;
                }
            }
        }
    };

    this.handleOrEnclose = function(){
        if(this.criterias[this.criterias.length-2] !== undefined){
            if(this.criterias[this.criterias.length-2].special !== undefined){
                switch(this.criterias[this.criterias.length-2].special){
                    case "OR": this.criterias.push({ special: ')' }); break;
                }
            }
        }
    };

    this.or = function(){
        if(this.criterias.length == 0) throw err; // or() for first is an error
        if(this.criterias[this.criterias.length-2] === undefined){
            // or() right after the first
            var tmp = this.criterias[this.criterias.length-1];
            this.criterias[this.criterias.length-1] = { special: '(' };
            this.criterias.push(tmp);
        } else if(this.criterias[this.criterias.length-2].special === 'AND'){
            // or() 
            var tmp = this.criterias[this.criterias.length-1];
            this.criterias[this.criterias.length-1] = { special: '(' };
            this.criterias.push(tmp);
        }
        this.criterias.push({ special: 'OR' });
        return this;
    };

    this.buildWhere = function(){
        if(this.criterias.length==0){
            return "";
        }
        var where = "WHERE (";
        for (i = 0; i < this.criterias.length; i++) {
            var criteria = this.criterias[i];
            if(criteria.special !== undefined){
                where += " "+criteria.special;
            }
            else if(criteria.where !== undefined){
                where += " "+criteria.where;
            }
            else{
                switch(criteria.operator){
                    case "IN": where += " `"+criteria.field+"` "+criteria.operator+" ('"+criteria.value.join("', '")+"') "; break;
                    case "NOT IN": where += " `"+criteria.field+"` "+criteria.operator+" ('"+criteria.value.join("', '")+"') "; break;
                    default: where += " `"+criteria.field+"` "+criteria.operator+" '"+criteria.value+"' "; break;
                }

            }
        }
        where += ')';
        return where;
    };

    this.getQuery = function(){
        var sql = "SELECT "+this.getFieldlistStr()+' FROM `'+this.model+'` '+this.buildWhere(); 
        if(this.offset && this.limit){
            sql += " LIMIT "+this.offset+", "+this.limit;
        }
        return sql;
    };
    
    this.offset = function(offset){
        this.offset = offset;
        return this;
    };
    
    this.limit = function(limit){
        this.limit = limit;
        return this;
    };
    
    this.orderBy = function(field, align){
        this.orderByList.push({field: field, align: align});
        return this;
    };
    
    this.find = function(cb){
        var sql = this.getQuery();
        this.execute(sql,cb);
    };
    
    this.findOne = function(cb){
       this.offset(0);
       this.limit(1);
       this.find(function(err, result){
           cb(err, result[0]);
       });
    };
    
    
    this.toArray = function(cb){
        var sql = this.getQuery();
        this.executeToArray(sql,cb);
    };
    
    this.execute = function(sql, cb){
        var that = this;
        this.db_pool.getConnection( function ( err, con ){
            // check for any connection errors
            if( err ){
                cb(err);
            }else{
                // connected
                con.query(
                    sql,
                    function ( err, rows, fields ){
                        if( err ){ 
                            cb(err);
                        }else{
                            that.populateResult(rows, cb);
                        }
                    }
                );
                con.release();
            }
        });
    };
    
    this.executeToArray = function(sql, cb){
        var that = this;
        this.db_pool.getConnection( function ( err, con ){
            // check for any connection errors
            if( err ){
                cb(err);
            }else{
                // connected
                con.query(
                    sql,
                    function ( err, rows, fields ){
                        if( err ){ 
                            cb(err);
                        }else{
                            that.populateResultToArray(rows, cb);
                        }
                    }
                );
                con.release();
            }
        });
    };
    
    this.populateResult = function(rows, cb){
        var result = [];
        for(i=0;i<rows.length;i++){
            var obj = new (require('./models/base/'+this.model))();
            obj.init(this.db, this.db_pool);
            obj.fromArray(rows[i]);
            obj.setNew(false);
            obj.resetModified();
            result.push(obj);
        }
        
        cb(null, result);
    };
    
    this.populateResultToArray = function(rows, cb){
        var result = [];
        for(i=0;i<rows.length;i++){
            var obj = new (require('./models/base/'+this.model))();
            obj.init(this.db, this.db_pool);
            obj.fromArray(rows[i]);
            obj.setNew(false);
            obj.resetModified();
            obj = obj.toArray();
            result.push(obj);
            obj = null;
        }
        
        cb(null, result);
    };
    return this;
}
module.exports = query;