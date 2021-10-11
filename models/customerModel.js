var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//var employee = require('../models/employeeModel');
var loan = require('../models/loanModel');

var customerSchema = new Schema({
    name                : {type: String},
    email_id            : {type: String},
    mobile_no           : {type: String},
    loan_type           : { type: String },
    loan_description    : { type: String },
    loan_ref_id         : {type: Schema.ObjectId, ref:"loan"}, 
    professional_type   : { type: String },
    organization_name   : { type: String },
    monthly_income   : { type: String },
    desired_fund_amount   : { type: String },
    loan_tenure   : { type: String },
    mothers_maiden_name   : { type: String },
    current_page        : { type: String },
    next_page           : { type: String },
    aadhar_no           : { type:  String },
    aadhar_details      : Schema.Types.Mixed,
    pan_no              : { type: String },
    pan_name            : { type: String },
    proof_of_documents   : [{
        doc_url          : {type: String},
        type             : {type: String},
        id_proof_name    : {type: String},
        createdAt       : {type: Date, default:Date.now},
    }],
    created_by           : {type: String},
    approved_bank        : { type: String },
    approved_amount      : {type: Number},
    is_active            : {type: Boolean, default: false},
    is_deleted           : {type: Boolean, default: false}

});

module.exports = mongoose.model("customers",customerSchema,"customers");