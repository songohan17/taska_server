var query = new (require('../../query'))();

function sample_content_query() {
    this.model = 'sample_content';

    this.fields = ['id', 'title', 'body'];
    
    this.criterias = [];

    this.findPk = function(id, cb){
        var sql = "SELECT "+this.getFieldlistStr()+" FROM sample_content WHERE id = '"+id+"'";
        this.execute(sql, cb);
    };

    this.findPks = function(arr, cb){
        var sql = "SELECT "+this.getFieldlistStr()+" FROM sample_content WHERE id IN ("+arr.join("', '")+")";
        // TODO
        return sql;
    };

    this.filterByPrimaryKey = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'Id',
            operator: (v.constructor === Array) ? 'IN' : '=',
            value: v,
        });

        this.handleOrEnclose();

        return this;
    };


    this.filterById = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'id',
            operator: (v.constructor === Array) ? 'IN' : '=',
            value: v,
        });

        this.handleOrEnclose();

        return this;
    };

    this.filterByTitle = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'title',
            operator: (v.constructor === Array) ? 'IN' : '=',
            value: v,
        });

        this.handleOrEnclose();

        return this;
    };

    this.filterByBody = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'body',
            operator: (v.constructor === Array) ? 'IN' : '=',
            value: v,
        });

        this.handleOrEnclose();

        return this;
    }; 
    
    
}
sample_content_query.prototype = query;
module.exports = sample_content_query;