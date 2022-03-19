var bankModel = require('../models/bankModel');
var loanSanctionModel = require('../models/loanSanctionModel');

var bankService = {}

bankService.addNewConfig = req => {
    console.log("req in service", req);
    return new Promise((resolve, reject) => {
        try{
            bankModel.create(req, (err, loan) => {
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

bankService.findAll = req => {
    return new Promise((resolve, reject) => {
        try {
            bankModel.find(req, (err, data) => {
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
};

bankService.findOne = function(req) {
    //console.log('req',req);
    return new Promise((resolve, reject) =>{
		try{
			bankModel.findOne(req, function(err, user) {
			   // console.log('err',err)
			   // console.log('user',user)

				if(err || !user) {
					return reject(err || 'No record found');
				}else {
					resolve(user);
				}
			})
		} catch(err) {
			return reject(err);
		}
	})
};

bankService.findCustomerLoanDetails = req  => {
    return new Promise((resolve, reject) =>{
		try{
			loanSanctionModel.findOne({'cust_ref_id':req.cust_ref_id}, function(err, user) {
			   // console.log('err',err)
			   // console.log('user',user)

				if(err || !user) {
					return reject(err || 'No record found');
				}else {
					resolve(user);
				}
			})
		} catch(err) {
			return reject(err);
		}
	})
};

//save customer loan sanction details
bankService.createCustomerLoanDetails = req => {
    console.log("req in service", req);
    return new Promise((resolve, reject) => {
        try{
            loanSanctionModel.create(req, (err, loan) => {
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

//Update customer loan sanction details
bankService.updateCustomerLoanDetails = req => {
    console.log("req in service", req);
    return new Promise((resolve, reject) => {
        try{
            loanSanctionModel.findByIdAndUpdate({req}, (err, loan) => {
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

module.exports = bankService;