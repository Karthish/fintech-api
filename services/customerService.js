var custModel = require('../models/customerModel');

var custMaster = {};



custMaster.addNewCustomer = req => {
    console.log("req", req);
    return new Promise((resolve, reject) => {
        try{
            if(!req._id) {
                req = new custModel(req);
            }
            custModel.findOneAndUpdate({_id: req._id}, req, {new: true, upsert: true}, function(err, data) {
                if (err || !data) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            })

        }catch(err){
        return reject(err)
        }
    })
};

custMaster.updateCutomerDetails = req => {
    return new Promise((resolve, reject) => {
        try{
            custModel.findOneAndUpdate({_id: req._id}, req, { new:true, setDefaultsOnInsert: false }, function(err, data) {
                if (err || !data) {
                    return reject(err);
                } else {
                    resolve(data);
                }
            })

        }catch(err){
            return reject(err)
        }
    })
};

custMaster.findUser = req => {
    // console.log("req", req);
    return new Promise((resolve, reject) => {
        try{
            custModel.findOne(req,function(err, cust) {
                if (err) {
                    return reject(err);
                } else {
                    resolve(cust);
                }
            })
        } catch(err) {
            return reject(err)
        }
    })
};


custMaster.findAndRemoveCust = req=> {
    return new Promise((resolve, reject)=> {
        try {
            custModel.findOneAndUpdate({_id: req._id}
                , {$set:{is_deleted: true, is_active: false}}
                , {new: true}, function(err, data) {
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



custMaster.findOneExitsCust = (can_id)=> {
    return new Promise((resolve, reject)=> {
        try{
            custModel.findOne({$or: [{'can_id': can_id, is_deleted: false}]},
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



module.exports = custMaster;