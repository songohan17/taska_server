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

Object.prototype.equals = function(x)
{
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

function base(){

    this._new = true;
    this._deleted = false;
    this.modifiedColumns = [];
    
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
    
    this.getFieldlistStr = function(){
        return '`'+this.fields.join("`, `")+'`';
    };
    
    this.rawData = function(){
        this.values;
    };
    
    this.execute = function(sql, cb){
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
                            cb(null, rows);
                        }
                    }
                );
                con.release();
            }
        });
    };
    // TODO: pre/post Save, Insert, Update, Delete
    
    return this;
}
module.exports = base;