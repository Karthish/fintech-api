var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bankSchema = new Schema({
    bank_name : { type: String },
    max_loan_amount:{ type: String },
    interest_rate:{ type: String },
    probability_percentage:{ type: String },
    processing_fee:{ type: String },
    emi:{ type: String }
})

module.exports = mongoose.model("bank", bankSchema);