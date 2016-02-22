function query() {

    this.init = function(db, db_pool){
        this.db = db;
        this.db_pool = db_pool;
    };
    
    this.filterByPrimaryKey = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : this.primaryKey,
            operator: (v.constructor === Array) ? 'IN' : '=',
            value: v,
        });

        this.handleOrEnclose();

        return this;
    };
    
    this.where = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({ where : v });

        this.handleOrEnclose();

        return this;
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
    
    this.offset = function(offset){
        if(offset != false){
            offset = parseInt(offset);
        }
        this.offsetValue = offset;
        return this;
    };
    
    this.limit = function(limit){
        if(limit != false){
            limit = parseInt(limit);
        }
        this.limitValue = limit;
        return this;
    };
    
    this.orderBy = function(field, align){
        this.orderByList.push({field: field, align: align});
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
    
    this.buildFieldlist = function(){
        return '`'+this.fields.join("`, `")+'`';
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
                // TODO escape
                if(criteria.value instanceof Array){
                    for(var i = 0; i<criteria.value.length; i++){
                        var escaped = this.db.escape( criteria.value[i] );
                        criteria.value[i] = escaped;
                    }
                }
                else{
                    var escaped = this.db.escape( criteria.value );
                    criteria.value = escaped;
                }
                switch(criteria.operator){
                    case "IN": where += " `"+criteria.field+"` "+criteria.operator+" ("+criteria.value.join(", ")+") "; break;
                    case "NOT IN": where += " `"+criteria.field+"` "+criteria.operator+" ("+criteria.value.join(", ")+") "; break;
                    default: where += " `"+criteria.field+"` "+criteria.operator+" "+criteria.value+" "; break;
                }
            }
        }
        where += ')';
        return where;
    };
    
    this.buildLimit = function(){
        
        if(this.offsetValue == false || this.limitValue == false){
            return "";
        }
        return " LIMIT "+this.offsetValue+", "+this.limitValue;
    };
    
    this.buildOrderby = function(){
        if(this.orderByList.length ==0) return "";
        var sql = " ORDER BY ";
        for(i=1; i<this.orderByList.length; i++){
            sql += "`"+this.orderByList[i].field+" "+this.orderByList[i].align+", ";
        }
        sql = sql.substr(0, sql.length - 2);
        return sql;
    };

    this.buildQuery = function(){
        return "SELECT "+this.buildFieldlist()+' FROM `'+this.model+'` '
                +this.buildWhere()
                +this.buildOrderby()
                +this.buildLimit(); 
    };
    
    this.buildDeleteQuery = function(){
        return 'DELETE FROM `'+this.model+'` '
                +this.buildWhere()
                +this.buildOrderby()
                +this.buildLimit(); 
    };
    
    // Executor functions
    
    this.find = function(cb){
        var sql = this.buildQuery();
        this.execute(sql,cb);
    };
    
    this.findOne = function(cb){
       this.offset(0);
       this.limit(1);
       this.find(function(err, result){
           cb(err, ( result[0]===undefined ) ? null : result[0]);
       });
    };
    
    this.findPk = function(id, cb){
        this.filterByPrimaryKey(id);
        this.find(function(err, result){
           cb(err, ( result[0]===undefined ) ? null : result[0]);
        });
    };

    this.findPks = function(arr, cb){
        this.filterByPrimaryKey(arr);
        this.find(cb);
    };
    
    this.toArray = function(cb){
        var sql = this.buildQuery();
        this.executeToArray(sql,cb);
    };
    
    this.clear = function(){ 
        this.criterias = [];
        this.orderByList = [];     
        this.offsetValue = false;
        this.limitValue = false;
        return this;
    };
    
    this.delete = function(cb){
        var sql = this.buildDeleteQuery();
        this.execute(sql,cb);
    };
    
    this.execute = function(sql, cb){
        var that = this;
        this.db_pool.getConnection( function ( err, con ){
            if( err ){ // check for any connection errors
                cb(err);
            }else{ // connected
                console.log(sql);
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
        this.db_pool.getConnection( function ( err, con ){ // check for any connection errors
            if( err ){
                cb(err);
            }else{ // connected
                console.log(sql);
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
            var obj = new (require('./models/'+this.model))();
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
            var obj = new (require('./models/'+this.model))();
            obj.init(this.db, this.db_pool);
            obj.fromArray(rows[i]);
            obj.setNew(false);
            obj.resetModified();
            obj = obj.toArray();
            result.push(obj);
        }
        cb(null, result);
    };
    
    return this;
}
module.exports = query;