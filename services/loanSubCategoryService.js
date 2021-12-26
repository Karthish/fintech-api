var loanSubCategoryModel = require('../models/loanSubCategoryModel');

var loanSubcategoryMaster = {};

loanSubcategoryMaster.create = req => {
    return new Promise((resolve, reject) => {
        try {
            loanSubCategoryModel.create(req, (err, loan) => {
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


loanSubcategoryMaster.findAll = req => {
    return new Promise((resolve, reject) => {
        try {
            loanSubCategoryModel.find(req, (err, loans) => {
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

module.exports = loanSubcategoryMaster