var mongoose = require("mongoose");
var Schema = mongoose.Schema

var loanSchema = new Schema({
    type:   { type: String },
    description:    { type: String}
})

module.exports = mongoose.model("loan", loanSchema)