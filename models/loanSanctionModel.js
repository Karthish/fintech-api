var mongoose = require("mongoose");
var Schema = mongoose.Schema

var loanSanction = new Schema({
    cust_ref_id:   { type: String },
    bank_ref_id:    { type: String},
    loan_application_number: { type: String },
    mobilenumber: { type: String},
    status: { type: String},
    statuscode: { type: Number},
    customerid: { type: String},
    reason: { type: String},
    product : { type: String},
    sanctionLimit : { type: String},
    responseDate : { type: Date},
    inPrincipleLimit : { type: Number},
    inPrincipleTenure : { type: Number},
})

module.exports = mongoose.model("loanSanction", loanSanction)