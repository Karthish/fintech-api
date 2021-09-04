const config = require('../config/config')[process.env.NODE_ENV || "dev"];
var customerService = require('../services/customerService');
var userService = require('../services/userService');
var randomize = require('randomatic');
var moment = require('moment');
var custCtrl = {};

custCtrl.getCustomerList = function(req, res) {
    var distributor_ref_id = req.query.distributor_ref_id;
    customerService.getDistributorList({distributor_ref_id: distributor_ref_id, is_deleted:false}).then(result => {
        res.send({
            status:true,
            msg:"User list found",
            data:result
        })
    }, err => {
        res.send({
            status:false,
            msg:"Invalid user details"
        })
    }).catch(err => {
        res.send({
            status:false,
            msg:"Unexpected Error"
        })
    })
};


custCtrl.addNewCustomer = function(req,res) {
    var selectedPlans = req.body.primary_plan;
    // console.log("req.body.", req.body.selectePlan);
    delete req.body.primary_plan;
    req.body['account_no'] = randomize('0', 8);
    req.body['account_id'] = randomize('0', 6);
    var userCollectionObj = {};
    customerService.findOneExitsCust(req.body.can_id).then(resp=> {
        console.log("customer exist", resp)
        if(resp.can_id == req.body.can_id) {
            res.send({
                status:false,
                msg:"Can ID is already exists"
            })
        }
    }, err=> {
        return customerService.addNewCustomer(req.body).then(result => {
            console.log("result", result);
            res.send({
                status:true,
                msg:"Customer added successfully",
                data:result
            }) 
        }).catch(err => {
            res.send({
                status:false,
                msg:"Unexpected Error"
            })
        })
    })

        
};

custCtrl.updateCustomer = function(req, res) {
    customerService.updateCutomerDetails(req.body).then(result => {
        console.log("result", result);
        if (req.body.selectePlan) {
            var month;
            var plan = req.body.selectePlan;
            if (plan.plan_validity == '1 year') {
                month = 12;
            } else {
                month = plan.plan_validity.split(" ")[0];
            }
            var now = new Date();
            plan['activate_date'] = now;
            var getExpDate = new Date(now.getFullYear(),now.getMonth() + parseInt(month - 1), now.getDate());
            plan['expired_date'] = moment(getExpDate).endOf('month');plan['cust_ref_id'] = result._id
            plan['plan_ref_id'] = plan._id;
            delete  plan['_id'];
            var findReq ={cust_ref_id: plan['cust_ref_id'], service_type: plan['service_type']}
        }
        
        res.send({
            status:true,
            msg:"user details updated successfully",
            data:result
        })
    },err => {
        res.send({
            status:false,
            msg:"Invalid user details"
        })
    }).catch(err => {
        res.send({
            status:false,
            msg:"Unexpected Error"
        })
    })
};



module.exports = custCtrl;