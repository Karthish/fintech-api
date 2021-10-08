var configModel = require('../models/configModel')

var configService = {}

configService.addNewConfig = req => {
    console.log("req in service", req);
    return new Promise((resolve, reject) => {
        try{
            configModel.create(req, (err, loan) => {
                if(err || !loan) {
                    return reject(err)
                }else{
                    return resolve(loan)
                }
            })

        }catch(err){
        return reject(err)
        }
    })
};

configService.findAll = req => {
    return new Promise((resolve, reject) => {
        try {
            configModel.find(req, (err, data) => {
                if(err || !data.length){
                    return reject(err)
                } else {
                    return resolve(data) 
                }
            })
        }catch(err) {
            return reject(err)
        }
    })
}


module.exports = configService;
