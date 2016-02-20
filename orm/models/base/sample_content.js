String.prototype.ucfirst = function()
{
    return this.charAt(0).toUpperCase() + this.substr(1);
}

var model = new (require('../../model'))();

function sample_content() {
    this.model = 'sample_content';
    this.startCopy = false;
    
    this.fields = ['id', 'title', 'body'];
    this.primaryKey = 'id';
    this.autoIncrement = true;

    this.values = {};
    this.values.id = null;
    this.values.title = null;
    this.values.body = null;
    
    this.modifiedColumns = [];

    this.alreadyInSave = false;

    this.alreadyInValidation = false;

    this.applyDefaultValues = function(){
        this.values.id = null;
        this.values.title = null;
        this.values.body = null;
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

    this.hasOnlyDefaultValues = function(){
        if(this.values.id !== null) return false;
        if(this.values.title !== null) return false;
        if(this.values.body !== null) return false;
        return true;
    };

    this.reload = function(cb){
        // TODO
    };

    this.delete = function(cb){
        var sql = "DELETE FROM sample_content WHERE Id ='"+this.getId()+"'";
        this.execute(sql,cb);
    };

    this.save = function(cb){
        if(this.isDeleted()) throw err;
        
        if(this.isNew()){ // INSERT
            this.doInsert(cb);
        }else{ // UPDATE
            this.doUpdate(cb);
        }
    };
    
    this.doInsert = function(cb){
        var valuesStr = "";
        valuesStr += "NULL, "; // TODO: handle auto increment
        valuesStr += "'"+this.getTitle()+"', ";
        valuesStr += "'"+this.getBody()+"', ";
        valuesStr = valuesStr.substr(0, valuesStr.length - 2); // TODO rtrim();
        var sql = "INSERT INTO `"+this.model+"` (`"+this.getFieldlistStr()+"` VALUES ("+valuesStr+")";
        console.log(sql);
    };
    
    this.doUpdate = function(cb){
        if(this.modifiedColumns.length == 0){
            cb(null);
            return;
        }
        var sql = "UPDATE `"+this.model+"` SET ";
        for(i=0; i<this.modifiedColumns.length; i++){
            sql += "`"+this.modifiedColumns[i]+"`='"+this['get'+this.modifiedColumns[i].toLowerCase().ucfirst()]()+"', "; 
        }
        sql = sql.substr(0, sql.length - 2); // TODO rtrim();
        sql += " WHERE `"+this.primaryKey+"` = '"+this['get'+this.primaryKey.toLowerCase().ucfirst()]()+"'";
        console.log(sql);
    };

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

    this.validate = function(){
         // TODO   
    };

    this.getPrimaryKey = function(){
       return this.getId();    
    };

    this.setPrimaryKey = function(v){
        return this.setId(v);  
    };

    this.isPrimaryKeyNull = function(){
        return (null == this.getPrimaryKey());   
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

    this.copy = function(){
       var newObj = Object.create(this);
       this.copyInto(newObj, true);
       return newObj;
    };

    this.clear = function(){
        this.values.id = null;    
        this.values.title = null;    
        this.values.body = null;

        this.alreadyInSave = false;
        this.alreadyInValidation = false;
        this.applyDefaultValues();
        this.resetModified();
        this.setNew(true);
        this.setDeleted(false);
    };

    this.toString = function(){
        return JSON.stringify(this.toArray());
    };

    this.isAlradyInSave = function(){
        return this.alreadyInSave;   
    };

    this.isAlradyInValidation = function(){
        return this.alreadyInValidation;
    };
}
sample_content.prototype = model;
module.exports = sample_content;