var mongoose = require("mongoose");
var Schema = mongoose.Schema

var loanSanction = new Schema({
    cust_ref_id:   { type: String },
    bank_ref_id:    { type: String},
    loan_details:  Schema.Types.Mixed,
})

module.exports = mongoose.model("loanSanction", loanSanction)