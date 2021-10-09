var configService = require('../services/configService');
var configCtrl = {};
//console.log('config controller enter');

function getConfigData() {
    return configService.findAll({}).then(result => {
        console.log('config data', result[1])
       
    }, err => {
        console.log('config err', err)
        
    }).catch(err => {
        console.log('config catch err', err)
    })
}
getConfigData();

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