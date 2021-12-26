var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var loan = require('../models/loanModel');

var loanSubCategorySchema = new Schema({
    type:   { type: String },
    description: { type: String},
    loan_ref_id: {type: Schema.ObjectId, ref:"loan"}
})

module.exports = mongoose.model("loanSubCategory", loanSubCategorySchema)