var bankService = require('../services/bankService');
var bankCtrl = {};


bankCtrl.addConfig = (req, res) => {
    console.log("req obj in ctrl", req.body)
    return bankService.addNewConfig(req.body).then(result => {
        res.send({
            status: true,
            msg: "Bank details added successfully"
        })
    }, err => {
        res.send({
            status: false,
            msg: "Invalid Request"
        })
    }).catch(err => {
        res.send({
            status:false,
            msg: "Unexpected Error"
        })
    })
}

bankCtrl.getConfig = (req, res) => {
    return bankService.findAll({}).then(result => {
        res.send({
            status: true,
            msg: "Configuration list",
            data: result
        })
    }, err => {
        res.send({
            status: false,
            msg: "Invalid Request"
        })
    }).catch(err => {
        res.send({
            status: false,
            msg: "Unexpected Error"
        })
    })
}

module.exports = bankCtrl;