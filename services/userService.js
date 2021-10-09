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
            userModel.findOneAndUpdate(req,{$set:{is_deleted: true, is_active: false}},
                {new: true},
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
            custModal.findOne(req, (err, user) => {
                if(err || !user) {
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


module.exports = userMaster;
