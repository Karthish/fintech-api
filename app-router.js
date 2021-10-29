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
var userService = require('./services/userService');

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


//Refernce API call
router.post('/user/reference', user.addOrUpdateReference);

//Payslip Upload API
var storage = multer.memoryStorage({
  destination: function(req, file, callback) {
      callback(null, '');
  }
});

var multipleUpload = multer({ storage: storage }).array('payslip');
router.put('/payslip/upload/:id',multipleUpload, function (req, res) {
  console.log('id', req.params.id);
  //req.params.id = '61701b77e6e218498cfa29e9';
  const file = req.files;
  console.log('files', file.length);
  console.log('files', file);
  if(!file.length){
    res.send({status:false, msg:"Last 3 months payslips are required"})
  }
  if(file.length < 3){
    res.send({ status: false, msg:"Last 3 months payslips are required"})
    return
  }
  if(file.length > 3){
    res.send({ status: false, msg:"Payslip counts must be 3"})
    return
  }

  let fileType = file.filter(fileType => {
    if(fileType.mimetype != 'application/pdf' ) {
      return true
    }else {
      return false
    }
  })

  console.log('fileType', fileType.length);

  if(fileType.length){
    res.send({ status: false, msg:'PDF file format is supported'})
    return
  }

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
                var reqObj = {};
                reqObj['id'] =  req.params.id;
                reqObj['files'] = ResponseData;
                reqObj['target'] = 'payslipUpload';
                userService.findByIdAndUpdate(reqObj).then(resp => {
                res.json({ "status": true, "Message": "File Uploaded SuceesFully", data: ResponseData});
                }, err => {
                  res.send({ "status": false, msg: err.message });
                }).catch(err => {
                  res.send({ "status": false, msg: err.message });
                })
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

