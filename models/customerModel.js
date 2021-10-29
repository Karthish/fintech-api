var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//var employee = require('../models/employeeModel');
var loan = require('../models/loanModel');
var bank = require('../models/bankModel');
var customerSchema = new Schema({
    name                : {type: String},
    email_id            : {type: String},
    mobile_no           : {type: String},
    loan_type           : { type: String },
    loan_description    : { type: String },
    loan_ref_id         : {type: Schema.ObjectId, ref:"loan"}, 
    bank_ref_id         : { type: Schema.ObjectId, ref:"bank"},
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
    payslip_documents   : Schema.Types.Mixed,
    created_by           : {type: String},
    approved_bank        : { type: String },
    approved_amount      : {type: Number},
    references           : [{
                                name: { type:String },
                                relationship: { type:String },
                                pin_code: { type:String },
                                phone_number: { type:String },
        
                            }],
    is_active            : {type: Boolean, default: false},
    is_deleted           : {type: Boolean, default: false}

});

module.exports = mongoose.model("customers",customerSchema,"customers");