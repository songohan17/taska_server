var query = new (require('../../query'))();

function sample_content_query_base() {
    this.model = 'sample_content';

    this.fields = ['id', 'title', 'body'];
    
    this.primaryKey = 'id';

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
    
    this.idLike = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'id',
            operator: 'LIKE',
            value: v+"%",
        });

        this.handleOrEnclose();

        return this;
    };

    this.titleLike = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'title',
            operator: 'LIKE',
            value: v+"%",
        });

        this.handleOrEnclose();

        return this;
    };

    this.bodyLike = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'body',
            operator: 'LIKE',
            value: v+"%",
        });

        this.handleOrEnclose();

        return this;
    };
    
    this.idNotLike = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'id',
            operator: 'NOT LIKE',
            value: v+"%",
        });

        this.handleOrEnclose();

        return this;
    };

    this.titleNotLike = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'title',
            operator: 'NOT LIKE',
            value: v+"%",
        });

        this.handleOrEnclose();

        return this;
    };

    this.bodyNotLike = function(v){
        this.handleContinuousFiltering();

        // add current
        this.criterias.push({
            field : 'body',
            operator: 'NOT LIKE',
            value: v+"%",
        });

        this.handleOrEnclose();

        return this;
    };
    
    return this;
}
sample_content_query_base.prototype = query;
module.exports = sample_content_query_base;