var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//var employee = require('../models/employeeModel');
var loan = require('../models/loanModel');
var bank = require('../models/bankModel');
var subcategory = require('../models/loanSubCategoryModel');
var loanSanction = require('../models/loanSanctionModel');
var customerSchema = new Schema({
    name                : {type: String},
    email_id            : {type: String},
    mobile_no           : {type: String},
    loan_type           : { type: String },
    loan_description    : { type: String },
    loan_ref_id         : {type: Schema.ObjectId, ref:"loan"}, 
    loan_subcategory_type: { type: String},
    loan_subcategory_description: { type: String },
    loan_subcategory_ref_id: { type: Schema.ObjectId, ref:"subcategory"},
    bank_ref_id         : { type: Schema.ObjectId, ref:"bank"},
    professional_type   : { type: String },
    organization_name   : { type: String },
    monthly_income      : { type: String },
    desired_fund_amount : { type: String },
    loan_tenure         : { type: String },
    mothers_maiden_name : { type: String },
    current_page        : { type: String },
    next_page           : { type: String },
    aadhar_no           : { type:  String },
    aadhar_details      : Schema.Types.Mixed,
    pan_no              : { type: String },
    pan_name            : { type: String },
    payslip_documents   : Schema.Types.Mixed,
    created_by          : {type: String},
    bank_name           : { type: String },
    account_no          : { type: String },
    ifsc_code           : { type: String },
    cancelled_cheque_doc: Schema.Types.Mixed,
    employee_id_doc     : Schema.Types.Mixed,
    bank_statement_doc  :  Schema.Types.Mixed,
    approved_amount     : {type: Number},
    references          : [{
                                name: { type:String },
                                relationship: { type:String },
                                pin_code: { type:String },
                                phone_number: { type:String },
        
                            }],

    sanction_letter_url : {type: String}, 
    sanction_letter_singned_url : {type: String}, 
    is_esigned          : {type: Boolean, default: false},
    esigned_date        : {type: Date},
    is_active           : {type: Boolean, default: false},
    is_deleted          : {type: Boolean, default: false},
    loan_application    : {type: String}, 
    amount_sanctioned   : {type: String}, 
    current_outstanding   : {type: String}, 
    next_due_date : {type: Date},
    amount_due   : {type: String}, 
    previous_due_date : {type: Date},
    previous_emi_amount : {type: String},
    current_due_status : {type: String},
    previous_due_status : {type: String},
    office_pin_code : { type: Number},
    loan_sanction_ref_id : { type: Schema.ObjectId, ref:"loanSanction"},
    loan_application_number: { type: Number },
    customer_ref_number:  { type: Number },
    customer_ref_id:  { type: Number },
    address_type: { type: String},
    marital_status: { type: String},
    father_name: { type: String},
    designation: { type: String}

});

module.exports = mongoose.model("customers",customerSchema,"customers");