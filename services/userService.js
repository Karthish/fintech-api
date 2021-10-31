var userModel = require('../models/userModel');
var custModal = require('../models/customerModel');

var userMaster = {};


userMaster.findOne = function(req) {
    console.log('req',req);
    return new Promise((resolve, reject) =>{
		try{
			userModel.findOne(req, function(err, user) {
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

userMaster.findOneAndUpdate = (req) => {
  console.log('enter service', req)
    return new Promise((resolve, reject) => {
        try {
            userModel.create(req, function (err, user) {
                if (err || !user) {
                    return reject(err || "No record found");
                } else {
                    resolve(user);
                }
            });
        } catch (err) {
            return reject(err);
        }
    })

};

userMaster.findAllEmp = function(req) {
  return new Promise((resolve, reject)=> {
    try {
        userModel.find(req,function(err,user) {
            if(err || !user){
                return reject(err);
            } else {
                resolve(user);
            }
        })
    } catch(err) {
        return reject(err);
    }
  })
};

userMaster.findByIdAndRemove = function(req) {
    return new Promise((resolve, reject)=> {
        try {
            custModal.findByIdAndRemove(req,
               
                function(err, user) {
                    if(err || !user) {
                        return reject(err);
                    } else {
                        resolve(user);
                    }

            })
        } catch(err) {
            return reject(err);
        }
    })
};


userMaster.getUserById = req =>{
    return new Promise((resolve, reject)=> {
        try{
            custModal.findById(req,function (err, data) {
                if (err || !data) {
                    return reject(err);
                }else{
                    resolve(data);
                }
            });
        }catch(err){
            return reject(err);
        }
    })
};

userMaster.updatePassword = req =>{
    return new Promise((resolve, reject)=> {
        try{
            userModel.findOneAndUpdate({"_id":req._id}, { secret: req.password }, function(err, user) {
                if (err || !user) {
                    return reject(err);
                }else{
                    resolve(user);
                }
            });
        }catch(err){
            return reject(err);
        }
    })
};


userMaster.findOneExitsUser = (email_id, mobile_no, emp_id)=> {
    return new Promise((resolve, reject)=> {
        try{
            userModel.findOne({$or: [{'email_id': email_id, is_deleted: false}
                ,{'mobile_no': mobile_no, is_deleted: false}]},
                function(err, data) {
                    if (err || !data) {
                        return reject(err);
                    } else {
                        resolve(data);
                    }
                })
        } catch(err) {
            return reject(err);
        }
    })
};

userMaster.findAndUpdateUser = (req)=> {
    return new Promise((resolve, reject)=> {
        try{
            userModel.findOneAndUpdate({emp_ref_id:req._id}, { role: req.role }, function(err, user) {
                if (err || !user) {
                    return reject(err);
                }else{
                    resolve(user);
                }
            });
        }catch(err){
            return reject(err);
        }
    })
};


userMaster.isUserExist = (email, mobile) => {
    return new Promise((resolve, reject) => {
        try{
            userModel.findOne({$or:[{'email_id':email, is_deleted: false}
                ,{'mobile_no':mobile, is_deleted: false}]},function(err, user){
                if(err || !user){
                    return reject(err)
                }else{
                    return resolve(user)
                }
            })

        }catch(err){
            return reject(err)
        }
    })
};


userMaster.addNewAdminUser = req => {
    return new Promise((resolve, reject)=> {
        try{
            userModel.create(req, function(err, user) {
                if (err || !user) {
                    return reject(err);
                }else{
                    return resolve(user);
                }
            });
        }catch(err){
            return reject(err);
        }
    })
}

userMaster.createUser = req => {
    return new Promise((resolve, reject)=> {
        try{
            custModal.create(req, function(err, user) {
                console.log('db err', err);
                console.log('db user', user);
                if (err || !user) {
                    return reject(err);
                }else{
                    return resolve(user);
                }
            });
        }catch(err){
            return reject(err);
        }
    })
}

userMaster.findUser = req => {
    return new Promise((resolve, reject) => {
        try {
            custModal.find(req, (err, user) => {
                if(err || user.length == 0) {
                    return reject(err)
                }else{
                    return resolve(user)
                }
            })
        }catch(err){
            return reject(err)
        }
    })
}

userMaster.findByIdAndUpdate = req => {
    console.log('findByIdAndUpdate', req);
    return new Promise((resolve, reject) => {
        try {
            let query = {};
            if(req.target == 'panDetails') {
                query = {$set: { "current_page": req.current_page, 
                                  "next_page":req.next_page,
                                  "pan_name":req.pan_name,
                                  "email_id":req.email_id,
                                  "mobile_no":req.mobile_no,
                                }}

            }else if(req.target == 'customerDetails') {
                console.log('customerDetails', req.target);
                //query['professional_type'] =  req.professional_type;
                //query['organization_name'] =  req.organization_name;
                //query['monthly_income'] =  req.monthly_income;
                //query['desired_fund_amount'] =  req.desired_fund_amount;
                //query['loan_tenure'] =  req.loan_tenure;
                //query['mothers_maiden_name'] =  req.mothers_maiden_name;
                //query['current_page'] =  "cust-details";
                //query['next_page'] = "funding-options";
                query = {$set: req}
            }else if(req.target == 'bankDetails'){
                console.log('bankDetails', req.target);
               // query['bank_ref_id'] = req.bank_ref_id;
                query = {$set: { "bank_ref_id": req.bank_ref_id }}
            }else if(req.target == 'payslipUpload'){
                console.log('payslipUpload', req.target);
                //query['payslip_documents'] = req.files;
                query = {$set: { "payslip_documents": req.files }}
            } else if(req.target == 'updateUser') {
                query = {$set: req};
                //query['email_id'] = req.email_id;
                //query['mobile_no'] = req.mobile_no;
            }

            console.log('req', req);
            console.log('query', query);

            custModal.findByIdAndUpdate(req.id, query, (err, user) => {
                if(err || !user) {
                    console.log('err', err);
                    return reject(err)
                }else{
                    return resolve(user)
                }
            })
        }catch(err){
            return reject(err)
        }
    })
};

userMaster.addOrUpdateReference = req => {
    console.log('addOrUpdateReference', req);
    return new Promise((resolve, reject) => {
        try {
            custModal.updateMany(
                { _id: req.id }, 
                 { references: req.references },{ new: true }, function(err, doc){
                     if(err){ return reject(err)}
                     else{
                         return resolve(doc)
                     }
                 });

        }catch(err){
            return reject(err)
        }
    })
}

module.exports = userMaster;
