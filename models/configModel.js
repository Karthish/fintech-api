var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configSchema = new Schema({
    secretAccessKey: { type: String },
    accessKeyId : { type: String },
    region : { type: String },
    bucket : { type: String },
    acl : { type: String },
    auth_key : { type: String },
    app_type : { type: String },
    consent : { type: String },
})

module.exports = mongoose.model("config", configSchema);