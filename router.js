var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var csvtojson = require('csvjson');
var fs = require('fs');
var path = require("path");
var conf = require('./config/config')[process.env.NODE_ENV || "dev"];
// console.log("config", config);
var request = require('request');

var user = require('./controllers/userCtrl.js');

var customer = require('./controllers/customerCtrl');
var loan  = require('./controllers/loanCtrl');
const express = require('express');
const router = express.Router();

router.get('/healthCheck', (req, res) =>
  res.send('OK')
);
module.exports = router;
var rootMaster ={};

rootMaster.secureRoutes = function (req,res,next) {
    var currentDate = new Date();
    var token = req.body.token || req.headers['x-access-token'] || req.query.token;
    if(token){
        jwt.verify(token, process.env.Key, function(err, decode){
            if(err){
                // If status = expired, prompt user to login again.
                if (err.name === 'TokenExpiredError') {
                    console.log("TokenExpiredError");
                }

                res.status(401).send({
                    msg: 'Invalid token'
                });
            } else {
                next();
            }
        })
    } else {
        res.status(401).send({
            msg: 'No token provider'
        });
    }
};

module.exports = rootMaster;

module.exports = function(app) {
     console.log('main app',app)
        app.get('/v1/test', function(req, res){
          console.log('welocme to Fintech WEB APPLICATION')
        });

        //Loans API
       // app.post('/api/v1/loan/create', loan.addNewLoan);
        //app.get('/api/v1/loan/list', loan.findLoans);

        app.post('/api/v1/user/create', user.createUser);

        
        //Common API
        app.post('/api/v1/login', user.login);
        app.post('/api/v1/adminSignup', user.adminSignup);
        app.post('/api/v1/changePassword', user.changePassword);
        app.post('/api/v1/profile', user.profile);
        app.post('/api/v1/forgotPassword', user.forgotPassword);

        
        //user module api
        app.get('/api/v1/user/list', customer.getCustomerList);
        app.post('/api/v1/user/add', customer.addNewCustomer);
        app.post('/api/v1/user/update', customer.updateCustomer);
         
    //ToDo: pdf attachment
        app.post('/api/v1/pdf', sendPdf);

        app.post('/api/v1/sendSms', function(req, res){
        var contactNumbers = ["9042110540"];
        contactNumbers.forEach(function(entry){
            request.post({
                    url: 'http://enterprise.smsgupshup.com/GatewayAPI/rest',
                    form:{
                        "method": "SendMessage",
                        "send_to": entry,
                        "msg": "Hi, The issue has been resolved",
                        "userid": "*****",
                        "password": "*******",
                        "auth_scheme":"plain",
                        "v": "1.0",
                        "format" : "text"
                    }
                },
                function (err, httpResponse, body) {
                    console.log('err', err);
                    console.log('httpResponse',httpResponse);
                    console.log('body result',body);
                    var responseObj = JSON.parse(body);
                    console.log('responseObj',responseObj);
                    if (err ) {

                    } else {

                    }
                })
        })
        })

}

var sendPdf =  function(req,res){
    // console.log("req", req);
    console.log("enter here");
    var transporter = nodemailer.createTransport('smtps://'+conf.mailer.id+':'+conf.mailer.password+'@smtp.gmail.com');

    console.log("__dirname", __dirname);
    var mailOptions = {
        from: '"company Name" <'+conf.mailer.id+'>',
        to: 'to eamil ID',
        subject: 'sample-pdf',
        html: 'sample pdf attachment',
        attachments: [
            // String attachment
            {
                filename: 'test.pdf',
                path:__dirname+'/config/sample.pdf',
                contentType: 'application/pdf' // optional, would be detected from the filename
            }
        ]
    };
    transporter.sendMail(mailOptions, function(err, res){
        if(err || res==false) {
            console.log("err",err)
        }else{
            console.log("response", res)
        }
        // resolve(res);
    });

};

var csvtojsonTest = function(req, res) {
    var data = fs.readFileSync(path.join(__dirname, req.files.file.path), { encoding : 'utf8'});
    var options = {
        delimiter : ',', // optional
        quote     : '"' // optional
    };
    var jsonObjArray = csvtojson.toObject(data, options);
    console.log('Result data', jsonObjArray)

   /* jsonObjArray.forEach(function(entry) {
        console.log('entry',entry);
        return customer.addNewCustomerData(entry).then()
    });*/
}

