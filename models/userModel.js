var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username            : { type: String },
    secret              : { type: String },
    role                : { type: String },
    emp_id 	            : { type: String },
    email_id            : { type: String },
    mobile_no           : { type: String },
    admin_ref_id        : { type: String },
    distributor_ref_id  : { type: String },
    emp_ref_id          : { type: String },
    cust_ref_id         : { type: String },
    created_by          : { type: String },
    cust_access         : { type: Boolean },
    // created_at          : { type: Date, default: Date.now },
    is_deleted          : { type: Boolean, default: false },
    is_active           : { type:Boolean, default: false },
    account_id          : { type: String }

});

module.exports= mongoose.model("admin_users", userSchema, "admin_users");