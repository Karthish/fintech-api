var loanModel = require('../models/loanModel');

var loanMaster = {};

loanMaster.create = req => {
    return new Promise((resolve, reject) => {
        try {
            loanModel.create(req, (err, loan) => {
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
}


loanMaster.findAll = req => {
    return new Promise((resolve, reject) => {
        try {
            loanModel.find(req, (err, loans) => {
                if(err || !loans.length){
                    return reject(err)
                }else {
                    return resolve(loans)
                }
            })
        }catch(err) {
            return reject(err)
        }
    })
}

module.exports = loanMaster