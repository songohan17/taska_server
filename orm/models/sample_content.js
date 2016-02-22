var base = new (require('./base/sample_content_base'))();

function sample_content() {
    this.values = {};
    this._new = true;
    this._deleted = false;
    this.startCopy = false;
    this.modifiedColumns = [];
    this.alreadyInSave = false;
    this.alreadyInValidation = false;
    return this;
}
sample_content.prototype = base;
module.exports = sample_content;