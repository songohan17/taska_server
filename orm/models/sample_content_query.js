var base = new (require('./base/sample_content_query_base'))();

function sample_content_query() {
    this.criterias = [];
    this.orderByList = [];     
    this.offsetValue = false;
    this.limitValue = false;
    return this;
}
sample_content_query.prototype = base;
module.exports = sample_content_query;