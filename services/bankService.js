var bankModel = require('../models/bankModel')

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


module.exports = bankService;