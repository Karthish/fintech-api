const express = require('express');
var router = express.Router();
var request = require('request');
var user = require('./controllers/userCtrl.js');
var loan  = require('./controllers/loanCtrl');
var config = require('./controllers/configCtrl');
var bank = require('./controllers/bankCtrl');
var multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
var configService = require('./services/configService');

router.get('/healthCheck', (req, res) => {
    res.send('Application connected with API');
});

//Test API
router.get('tmproute', user.testFunction);

//Config API
router.post('/config/create', config.addConfig);
router.get('/config/list', config.getConfig);

//Loans API
router.post('/loan/create', loan.addNewLoan);
router.get('/loan/list', loan.findLoans);

//PAN VERIFICATION API
router.post('/pan/verify',user.panVerification);

//AADHAR API
router.post('/aadhar/generate/accesskey', user.aadharVerification);
// router.post('aadhar/otp/generate', user.aadharOTPGeneration);
router.post('/aadhar/otp/verify', user.aadharOTPVerification);

//Check user status API
router.get('/user/status/:id', user.getUser);
router.post('/user/details', user.updateUserDetails)

//Delete User Records
router.delete('/user/:id', user.findByIdAndRemove);

//Bank details API call
router.post('/bank/create', bank.addConfig);
router.get('/bank/list', bank.getConfig);
router.post('/bank/update', user.updateBankDetails);

//Payslip Upload API
var storage = multer.memoryStorage({
  destination: function(req, file, callback) {
      callback(null, '');
  }
});

var multipleUpload = multer({ storage: storage }).array('payslip');
router.post('/payslip/upload',multipleUpload, function (req, res) {
  const file = req.files;
  console.log('files', file);

    return configService.findAll({}).then(result => {
    console.log('config data', result[0]);
    let credentials = result[0];
    let s3bucket = new aws.S3({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      Bucket: credentials.bucket
    });
  s3bucket.createBucket(function () {
        let Bucket_Path = 'https://aryaa-filecontianer-dev.s3.ap-south-1.amazonaws.com/fileuploads/';
        //Where you want to store your file
        var ResponseData = [];
     
  file.map((item) => {
        var params = {
          Bucket: credentials.bucket,
          Key: item.originalname,
          Body: item.buffer,
          ACL: credentials.acl
    };
  s3bucket.upload(params, function (err, data) {
          if (err) {
           res.json({ "status": false, "Message": err});
          }else{
              ResponseData.push(data);
              if(ResponseData.length == file.length){
                res.json({ "status": true, "Message": "File Uploaded SuceesFully", data: ResponseData});
              }
            }
         });
       });
     });
 }, err => {
   res.send({ "status":false, msg:"Invalid config details"})
 }).catch(err => {
   res.send({ "status":false, msg:"Something went wrong"})
 })
});

module.exports = router;

