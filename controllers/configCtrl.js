var configService = require('../services/configService');
var configCtrl = {};

configCtrl.addConfig = (req, res) => {
    console.log("req obj in ctrl", req.body)
    return configService.addNewConfig(req.body).then(result => {
        res.send({
            status: true,
            msg: "Configuration added successfully"
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

configCtrl.getConfig = (req, res) => {
    return configService.findAll({}).then(result => {
        res.send({
            status: true,
            msg: "Configuration list",
            data: result[0]
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

module.exports = configCtrl;