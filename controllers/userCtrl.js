var userService = require('../services/userService.js');

var common = require('../common/common.js');

var jwt = require('jsonwebtoken');
var random = require('randomstring');
var randomize = require('randomatic');
var request = require('request');
var config = require('../config/config')[process.env.NODE_ENV || "dev"];;
var userMaster = {};

userMaster.testFunction = function(req,res) {

    res.send('working fine');
}

userMaster.panVerification = function(req,res) {
    //console.log('enter here', req);
    var data = JSON.stringify({pan:req.body.pan, consent: `${config.karza.consent}`});

    console.log('+++++++++++++++++++++++++ PAN request obj ++++++++++++++++++++++++++++++')
    console.log(data);

    request.post({url:`${config.pan.VERIFICATION_API}`, headers: {
        'Content-Type': `${config.karza.app_type}`,
        'x-karza-key': `${config.karza.auth_key}`
      }, body: data}, function(err,httpResponse,body){ 
        console.error('error:', err);
        //console.error('httpResponse:', httpResponse);
        console.error('body:', body);
        if(body['status-code'] == 101){
            res.send(body);
        }else {
            res.send({
                status:false,
                msg: "Invalid request details"
            })
        }
        

       })

}

userMaster.aadharVerification = function(req, res) {
    let currentTime = new Date().getTime().toString().substr(0,10);
    let caseId = randomize('0',6);
    console.log("req Obj", req.body);

    var options = { method: 'POST',
    url: `${config.aadhar.CONSENT_API}`,
    headers: { 
        'Content-Type': `${config.karza.app_type}`,
        'x-karza-key': `${config.karza.auth_key}`
     },
    body:
     {"ipAddress":"12.12.12.12",
    "userAgent":"Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
     "consent":"Y",
     "name":req.body.name,
     "consentTime":currentTime,
     "consentText":"Consent accepted",
     "clientData":{"caseId":caseId}},
    json: true };
  
    console.log('+++++++++++++++++++++++++ aadhaar-consent request obj ++++++++++++++++++++++++++++++')
    console.log(options.body);
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    let consentResp = body;
    console.log('+++++++++++++++++++++++++ aadhaar-consent Response obj ++++++++++++++++++++++++++++++')
    console.log('consentResp', consentResp);
   if(consentResp) {
       setTimeout(() => {
                var options = { method: 'POST',
                url: `${config.aadhar.OTP_VERIFY_API}`,
                headers: { 
                    'Content-Type': `${config.karza.app_type}`,
                    'x-karza-key': `${config.karza.auth_key}`},
                body:
                {"consent": "Y",
                "aadhaarNo": req.body.aadhaarNo,
                "accessKey": consentResp.result.accessKey,
                "clientData":{"caseId":caseId}},
                json: true };
            
                console.log('+++++++++++++++++++++++++ aadhaar-OTP generation request obj ++++++++++++++++++++++++++++++')
                console.log(options.body);
                request(options, function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log('+++++++++++++++++++++++++ aadhaar-OTP generation response obj ++++++++++++++++++++++++++++++');
                    console.log(body);
                    res.send(body)
                })
       }, 3000);
   }


  });

}

// userMaster.aadharOTPGeneration = function(req, res) {
//     var options = { method: 'POST',
//     url: 'https://testapi.karza.in/v3/get-aadhaar-otp',
//     headers: { 'content-type': 'application/json', 'x-karza-key': 'FQdEGtWHuHV4GebM' },
//     body:
//      {"consent": "Y",
//      "aadhaarNo": "937766457267",
//      "accessKey": "f84055d8-e17b-4848-afc4-98e8ff3bd07b",
//      "clientData":{"caseId":"810861"}},
//     json: true };

//     console.log('+++++++++++++++++++++++++ aadhaar-OTP generation request obj ++++++++++++++++++++++++++++++')
//     console.log(options.body);
//     request(options, function (error, response, body) {
//         if (error) throw new Error(error);
//         console.log('+++++++++++++++++++++++++ aadhaar-OTP generation response obj ++++++++++++++++++++++++++++++');
//         console.log(body);
//         res.send(body)
//     })
// }
userMaster.aadharOTPVerification = function(req, res) {
    let shareCode = randomize('0',4);
    console.log('aadharOTPVerification req obj:', req.body);
    var options = { method: 'POST',
    url: 'https://testapi.karza.in/v3/get-aadhaar-file',
    headers: { 
        'Content-Type': `${config.karza.app_type}`,
        'x-karza-key': `${config.karza.auth_key}`
     },
    body:
    {
        "consent": "Y",
        "otp": req.body.otp,
        "shareCode": shareCode,
        "accessKey": req.body.accessKey,
        "clientData": {
        "caseId": req.body.caseId
        }},
    json: true };

    console.log('+++++++++++++++++++++++++ aadhaar download request obj ++++++++++++++++++++++++++++++');
    console.log(options.body);
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log('+++++++++++++++++++++++++ aadhaar download response obj ++++++++++++++++++++++++++++++');
        console.log(body);
        let reqobj = body;
        req.body.name = reqobj.result.dataFromAadhaar.name;
        req.body.email_id = reqobj.result.dataFromAadhaar.emailHash;
        req.body.mobile_no = reqobj.result.dataFromAadhaar.mobileHash;
        return userService.createUser(req.body).then(resp => {
            let responseObj = {};
            responseObj['_id'] = resp._id;
            responseObj['name'] = resp.name;
            responseObj['created_at'] = resp.created_at;
            res.send({
                status : true,
                msg: "User created successfully",
                data : responseObj,
            });
        }, err => {
            res.send({
                status : true,
                data : {},
                msg: "Invalid Request"
            });
        }).catch(err => {
            console.log('catch err', err)
            res.send({
                status : true,
                data : {},
                msg: "somthing went wrong"
            });
        })
    })
}


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
