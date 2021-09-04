var userService = require('../services/userService.js');

var common = require('../common/common.js');

var jwt = require('jsonwebtoken');
var random = require('randomstring');
var randomize = require('randomatic');

var userMaster = {};

userMaster.login = function(req,res) {
	var user = req.body;
	var output = {};
	userService.findOne({username: user.username,is_deleted: false}).then(resp => {
		output = resp;
		return common.compareHash(user.password, resp.secret);
	}).then(resp=> {
	// var token = jwt.sign({username: output.username }, process.env.Key, {expiresIn: '1min'} );
		res.send({
			status : true,
			data : output,
		});
	}).catch(err=> {
		res.send({
			status : false,
			msg : "Invalid Username/Password"
		});
	});
};

userMaster.adminSignup = function (req, res) {

    var user = req.body.secret;
    // console.log('signup admin',user);

    common.genHash(user).then(result => {
        // console.log('output hash',output);
        res.send({
            status: true,
            msg: "Hash key generation successfully",
            data: result.id
        });
    }, err => {
        res.send({
            status: false,
            msg: "Mismatched Key"
        });
    }).catch(err => {
        res.send({
            status: false,
            msg: "No Records Found"
        });
    })
};

userMaster.changePassword = function(req, res){
	var user = req.body;
    userService.getUserById(user._id).then(result=>{
        console.log("result", result);
        // console.log('output get user by id',output);
        return common.compareHash(user.oldPassword, result.secret, result);
    }).then(result => {
        console.log("result", result);
        return common.genHash(user.newPassword);
    }).then(result => {
        return userService.updatePassword({_id:user._id, password : result});
	}).then(result=>{
        console.log("result", result);
        res.send({
            status: true,
            msg: "password Updated Successfully"
        });
    },err=>{
            console.log("err", err);
        res.send({
            status: false,
            msg: "Invalid Data",
            data:{}

        });
    }).catch(err=>{
        res.send({
            status:false,
            msg: "No Records Found",
            data:{}

        });
    });
};


userMaster.profile = function(req,res) {
    userService.findOne(req.body).then(result => {
        console.log("findOne Result",result);
        res.send({
            status:true,
            msg:"User details found",
            data:result
        })
    },err => {
        res.send({
            status:false,
            msg:"Inavlid user details"
        })
    }).catch(err => {
        res.send({
            status:false,
            msg:"Unexpected Error"
        })
    })
};




userMaster.forgotPassword = function(req, res) {
    var user = req.body;
    var userObj = {};
    var pwd = '';
    var updateObj = {};
    var emailObj = {};

    return userService.findMobileUserLogin({account_id: user.account_id,is_deleted: false}).then(resp => {
        userObj = resp;
        // console.log('user result',userObj);
        pwd = random.generate(6);
        // console.log('user password', pwd);
        updateObj['_id'] = userObj._id;
        return common.genHash(pwd);
    }).then(result => {
        updateObj['password'] = result;
        return userService.updatePassword(updateObj)
    }).then(result => {
        emailObj['to'] = userObj.email_id;
        emailObj['subject'] = 'Forgot Password';
        emailObj['html'] = '<h2> Hi' + userObj.username+ '</h2>'+
            '<div>Your password has generated. Kindly use following the given password for your login</div>'+
            '<div> <span> Account ID : </span>' + userObj.account_id + '</div>' +
            '<div> <span> Password : </span>' + pwd + '</div>' +
            '<div style="margin-top: 20px"> <span> <u><b>Note</b></u></span></div>' +
            '<p> * Use your login credentials </p>'
        return common.sendMail(emailObj)

    }).then(result => {
        res.send({
            status:true,
            msg:"User password has reset",
            data:updateObj
        })
    },err => {
        res.send({
            status:false,
            msg:"Invalid user details",
            data:{}
        })
    }).catch(err => {
        res.send({
            status:false,
            msg:"Unexpected Error",
            data:{}
        })
    })
};




userMaster.createUser = function(req, res){
  console.log('enter ctrl')
  req['username'] = 'admin';
  req['email_id'] = 'admin@gmail.com';
  req['secret'] = 'admin';
  return userService.findOneAndUpdate(req).then(resp=> {
    console.log('response', resp);
    res.send({
      status:true,
      msg:"User added successfully",
      data:resp
  })

  },err=>{
    res.send({
        status: false,
        msg: "Invalid user details",
        data:{}

    })
  })
}
module.exports = userMaster;
