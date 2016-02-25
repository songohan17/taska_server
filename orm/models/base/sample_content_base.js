var model = new (require('../../model'))();

function sample_content_base() {
    this.model = 'sample_content';
    this.fields = ['id', 'title', 'body'];
    this.primaryKey = 'id';
    this.autoIncrement = true;

    this.values = {};
    /* Declare values */
    this.values.id = null;
    this.values.title = null;
    this.values.body = null;
    
    /* Getters */
    
    this.getByName = function(name){
        switch(name.toLowerCase()){
            case 'id': return this.getId();
            case 'title': return this.getTile();
            case 'body': return this.getBody();
        };    
    };

    this.getByPosition = function(pos){
        switch(pos){
            case 0: return this.getId();
            case 1: return this.getTile();
            case 2: return this.getBody();
        };

    };

    this.getId = function(){
        return this.values.id;
    };

    this.getTitle = function(){
        return this.values.title;
    };

    this.getBody = function(){
        return this.values.body;
    };
    
    /* Setters */

    this.setId = function(v){
        if(v !== null){
            v = parseInt(v); // depend on type, this is int
        }
        if(this.values.id !== v){
            this.values.id = v; 
            this.modifiedColumns.push('id');
        }
        return this;
    };

    this.setTitle = function(v){
        if(v !== null){
            v = v.toString(); // depend on type, this is int
        }
        if(this.values.title !== v){
            this.values.title = v; 
            this.modifiedColumns.push('title');
        }
        return this;
    };

    this.setBody = function(v){
        if(v !== null){
            v = v.toString(); // depend on type, this is int
        }
        if(this.values.body !== v){
            this.values.body = v; 
            this.modifiedColumns.push('body');
        }
        return this;
    };
    
    /* OTHERS */
    
    this.applyDefaultValues = function(){
        this.values.id = null;
        this.values.title = null;
        this.values.body = null;
    };

    this.hasOnlyDefaultValues = function(){
        if(this.values.id !== null) return false;
        if(this.values.title !== null) return false;
        if(this.values.body !== null) return false;
        return true;
    };
    
    this.doInsert = function(cb){
        var valuesStr = "";
        if(this.autoIncrement){
            valuesStr += "NULL, ";
        }else{
            valuesStr += this.db.escape(this.id)+", ";
        }
        valuesStr += this.db.escape(this.title)+", ";
        valuesStr += this.db.escape(this.body)+", ";
        valuesStr = valuesStr.substr(0, valuesStr.length - 2); // TODO rtrim();
        var sql = "INSERT INTO `"+this.model+"` ("+this.buildFieldlist()+") VALUES ("+valuesStr+")";
        this.execute(sql, cb);
    };
    
    this.doUpdate = function(cb){
        if(this.modifiedColumns.length == 0){
            cb(null);
            return;
        }
        var sql = "UPDATE `"+this.model+"` SET ";
        for(i=0; i<this.modifiedColumns.length; i++){
            sql += "`"+this.modifiedColumns[i]+"`="+this.db.escape(this.values[this.modifiedColumns[i].toLowerCase()])+", "; 
        }
        sql = sql.substr(0, sql.length - 2); // TODO rtrim();
        sql += " WHERE `"+this.primaryKey+"` = "+this.db.escape(this.values[this.primaryKey.toLowerCase()]);
        this.execute(sql, cb);
    };
    
    this.copyInto = function(copyObj, makeNew){
        if(makeNew === undefined){
            makeNew = true;
        }  
        copyObj.setTitle(this.getTitle());
        copyObj.setBody(this.getBody());
        if(makeNew){
            copyObj.setNew(true);
            copyObj.setId(null); 
        }
    };

    this.toArray = function(){
        result = {};
        result.id = this.getId();
        result.title = this.getTitle();
        result.body =this.getBody();
        return result;
    };

    this.fromArray = function(obj){
        if(obj.id !== undefined) this.setId(obj.id); 
        if(obj.title !== undefined) this.setTitle(obj.title);
        if(obj.body !== undefined) this.setBody(obj.body);
        return this;
    };
    
    this.buildBulkInsertRow = function(){
        var sql = "(";
        if(this.autoIncrement){
            sql += "NULL, ";
        }else{
            sql += this.db.escape(this.id)+", ";
        }
        sql += this.db.escape(this.title)+", ";
        sql += this.db.escape(this.body)+", ";
        sql = sql.substr(0, sql.length - 2);
        sql += ")";
        return sql;
    };

    this.validate = function(){
         // TODO   
    };
    
    return this;
}
sample_content_base.prototype = model;
module.exports = sample_content_base;