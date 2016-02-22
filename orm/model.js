Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

Object.prototype.equals = function(x){
    for(p in this)
    {
    	switch(typeof(this[p]))
    	{
    		case 'object':
    			if (!this[p].equals(x[p])) { return false }; break;
    		case 'function':
    			if (typeof(x[p])=='undefined' || (p != 'equals' && this[p].toString() != x[p].toString())) { return false; }; break;
    		default:
    			if (this[p] != x[p]) { return false; }
    	}
    }

    for(p in x)
    {
    	if(typeof(this[p])=='undefined') {return false;}
    }

    return true;
}

String.prototype.ucfirst = function()
{
    return this.charAt(0).toUpperCase() + this.substr(1);
}

function model(){
    
    this.init = function(db, db_pool){
        this.db = db;
        this.db_pool = db_pool;
    };

    this.isModified = function(){
        return (this.modifiedColumns.length > 0) ? true : false;
    };

    this.getModifiedColumns = function(){
        return this.modifiedColumns.getUnique();
    };

    this.isColumnModified = function(col){
        return (this.modifiedColumns.indexOf(col) == -1) ? false : true;
    };

    this.resetModified = function(col){
        if(col === undefined){
            this.modifiedColumns = [];
        }else{
            if(this.isColumnModified(col)){
                this.modifiedColumns.splice(this.modifiedColumns.indexOf(col), 1);
            }
        }
        return this;
    };

    this.isNew =  function(){
        return this._new;
    };

    this.setNew =  function(b){
        this._new = b;
        return this;
    };

    this.isDeleted =  function(){
        return this._deleted;
    };

    this.setDeleted =  function(b){
        this._deleted = b;
        return this;
    };

    this.isEqual = function(obj){
        return JSON.stringify(this) === JSON.stringify(obj); 
    };

    this.isDeepEqual = function(obj){
        return this.equals(obj);
    };
    
    this.buildFieldlist = function(){
        return '`'+this.fields.join("`, `")+'`';
    };
    
    this.rawData = function(){
        this.values;
    };
    
    this.getPrimaryKey = function(){
       return this['get'+this.primaryKey.toLowerCase().ucfirst()]();    
    };

    this.setPrimaryKey = function(v){
        return this['set'+this.primaryKey.toLowerCase().ucfirst()](v);  
    };

    this.isPrimaryKeyNull = function(){
        return (null == this.getPrimaryKey());   
    };

    this.isAlradyInSave = function(){
        return this.alreadyInSave;   
    };

    this.isAlradyInValidation = function(){
        return this.alreadyInValidation;
    };
    
    this.toString = function(){
        return JSON.stringify(this.toArray());
    };
    
    this.execute = function(sql, cb){
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
    
    this.copy = function(){
       var newObj = Object.create(this);
       this.copyInto(newObj, true);
       return newObj;
    };
    
    this.clear = function(){  
        for(v in this.values){
            this.values[v] = null;
        }
        this.alreadyInSave = false;
        this.alreadyInValidation = false;
        this.applyDefaultValues();
        this.resetModified();
        this.setNew(true);
        this.setDeleted(false);
    };
    
    this.delete = function(cb){
        var sql = "DELETE FROM `" + this.model + "` \n\
                    WHERE `" + this.primaryKey + "` = " + this.db.escape(this.getPrimaryKey());
        this.preDelete(function(sql,cb){
            this.execute(sql,function(err, rows){
                this.postDelete(cb(err, rows));
            });
        });
    };
    
    this.reload = function(cb){
        if(this.isNew()) throw Error('New can not be reloaded');
        var sql = "SELECT " + this.buildFieldlist() + " FROM `" + this.model + "` \n\
                    WHERE `" + this.primaryKey + "` = " + this.db.escape(this.getPrimaryKey());
        this.execute(sql,function(err, rows){
            if(err){
                cb(err);
            }else{
                this.fromArray(rows[0]);
                this.setNew(false);
                this.resetModified();
                cb(null, this);
            }
        });
    };

    this.save = function(cb){
        var that = this;
        if(that.isDeleted()) throw Error("Already deleted");
        if(that.isNew()){ // INSERT
            that.doInsert(cb);
        }else{ // UPDATE
            that.doUpdate(cb);
        }  
    };
    
    this.preSave = function(cb){
       cb(); 
    };
    
    this.preInsert = function(cb){
       cb(); 
    };
    
    this.preUpdate = function(cb){
       cb(); 
    };
    
    this.postSave = function(err, rows, cb){
       cb(err, rows); 
    };
    
    this.postInsert = function(err, rows, cb){
       cb(err, rows); 
    };
    
    this.postUpdate = function(err, rows, cb){
       cb(err, rows); 
    };
    
    return this;
}
module.exports = model;