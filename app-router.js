const express = require('express');
var router = express.Router();
var request = require('request');
var multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const pjson = require("./package.json");

var user = require('./controllers/userCtrl.js');
var loan  = require('./controllers/loanCtrl');
var config = require('./controllers/configCtrl');
var bank = require('./controllers/bankCtrl');
var loanSubCategory = require('./controllers/loanSubCategoryCtrl');

var configService = require('./services/configService');
var userService = require('./services/userService');


router.get('/healthCheck', (req, res) => {
    res.send('Application connected with API');
});

router.get('/version', (req, res) => {
    console.log(pjson.version);
    res.send(pjson.version);
});


//Test API
router.get('/tmproute', user.testFunction);

//Config API
router.post('/config/create', config.addConfig);
router.get('/config/list', config.getConfig);

//Loans API
router.post('/loan/create', loan.addNewLoan);
router.get('/loan/list', loan.findLoans);

//Loans SubCategory API 
router.post('/loan/subcategory/create', loanSubCategory.addNewLoanSubCategory);
router.post('/loan/subcategory/list', loanSubCategory.findLoanSubCategory);

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
router.post('/bank/detail', user.getBankDetails);


//Refernce API call
router.post('/user/reference', user.addOrUpdateReference);
router.put('/user/details/update/:id', user.updateDetails);

//Sanction Letter API call
router.post('/user/sanction/download', user.sanctionPdfDownload);

router.post('/user/sanction/attachment', user.sanctionAttachment);

router.post('/user/sanction/esign', user.esignVerification);

router.post('/user/target/update', user.updateTargetPage);

router.post('/user/dashboard/update', user.updateDashboard);
router.get('/user/dashboard/:id', user.getDashboard);

router.post('/early/salary/token', user.generateToken);
router.post('/early/salary/status', user.earlySalaryLoanStatus);

router.post('/user/uan/otp/verification', user.uanOtpVerification)

//Payslip Upload API
var storage = multer.memoryStorage({
  destination: function(req, file, callback) {
      callback(null, '');
  }
});

var multipleUpload = multer({ storage: storage }).array('payslip');
router.put('/payslip/upload/:id',multipleUpload, function (req, res) {
  const file = req.files;
  if(!file.length){
    res.send({status:false, msg:"Last 3 months payslips are required"})
  }
  if(file.length > 3){
    res.send({ status: false, msg:"Last 3 months payslips are required"})
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
    res.send({ status: false, msg:'PDF file format only is supported'})
    return
  }

    return configService.findAll({}).then(result => {
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
           res.json({ "status": false, "msg": err});
          }else{
              ResponseData.push(data);
              if(ResponseData.length == file.length){
                var reqObj = {};
                reqObj['id'] =  req.params.id;
                reqObj['payslip_documents'] = ResponseData;
                reqObj['target'] = 'payslipUpload';
                reqObj['current_page'] = 'cust-details';
                reqObj['next_page'] = 'loan-offer-list';
                userService.findByIdAndUpdate(reqObj).then(resp => {
                res.json({ "status": true, "msg": "File Uploaded SuceesFully", data: ResponseData});
                }, err => {
                  res.send({ "status": false, msg: err });
                }).catch(err => {
                  res.send({ "status": false, msg: err });
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

var cancelledChequeUpload = multer({storage: storage}).array('cancelledcheck');
var empIdUpload = multer({storage: storage}).array('empId');
var bankstatement = multer({storage: storage}).array('bankstatement');

router.post('/cancelledcheck/upload', cancelledChequeUpload, function(req, res){
  var extraData = JSON.parse(req.body.eSingData);
  const file = req.files;
  return configService.findAll({}).then(result => {
    let credentials = result[0];
    let s3bucket = new aws.S3({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      Bucket: credentials.bucket
    });
  s3bucket.createBucket(function () {
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
           res.json({ "status": false, "msg": err});
          }else{
              ResponseData.push(data);
              if(ResponseData.length == file.length){
                var reqObj = {};
                reqObj['id'] =  extraData.id;
                reqObj['bank_name'] =  extraData.bank_name;
                reqObj['account_no'] =  extraData.account_no;
                reqObj['ifsc_code'] =  extraData.ifsc_code;
                reqObj['cancelled_cheque_doc'] = ResponseData;
                reqObj['target'] = 'postEsign';
                reqObj['current_page'] = 'post-esign';
                reqObj['next_page'] = 'dashboard';
                userService.findByIdAndUpdate(reqObj).then(resp => {
                res.send({ "status": true, "msg": "Cancelled Cheque Uploaded SuceesFully", data: ResponseData});
                }, err => {
                  res.send({ "status": false, msg: err });
                }).catch(err => {
                  res.send({ "status": false, msg: err });
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
})

router.post('/empId/upload', empIdUpload, function(req, res){
  var extraData = JSON.parse(req.body.empid_esign);
  const file = req.files;
  return configService.findAll({}).then(result => {
    let credentials = result[0];
    let s3bucket = new aws.S3({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      Bucket: credentials.bucket
    });
  s3bucket.createBucket(function () {
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
           res.json({ "status": false, "msg": err});
          }else{
              ResponseData.push(data);
              if(ResponseData.length == file.length){
                var reqObj = {};
                reqObj['id'] =  extraData.id;
                reqObj['employee_id_doc'] = ResponseData;
                reqObj['target'] = 'postEsign';
                reqObj['current_page'] = 'post-esign';
                reqObj['next_page'] = 'dashboard';
                userService.findByIdAndUpdate(reqObj).then(resp => {
                res.json({ "status": true, "msg": "Employee ID Uploaded SuceesFully", data: ResponseData});
                }, err => {
                  res.send({ "status": false, msg: err });
                }).catch(err => {
                  res.send({ "status": false, msg: err });
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
})

router.post('/bankstatement/upload', bankstatement, function(req, res){
  var extraData = JSON.parse(req.body.accstatement_esign);
  const file = req.files;
  return configService.findAll({}).then(result => {
    let credentials = result[0];
    let s3bucket = new aws.S3({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      Bucket: credentials.bucket
    });
  s3bucket.createBucket(function () {
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
           res.json({ "status": false, "msg": err});
          }else{
              ResponseData.push(data);
              if(ResponseData.length == file.length){
                var reqObj = {};
                reqObj['id'] = extraData.id;
                reqObj['bank_statement_doc'] = ResponseData;
                reqObj['target'] = 'postEsign';
                reqObj['current_page'] = 'post-esign';
                reqObj['next_page'] = 'dashboard';
                userService.findByIdAndUpdate(reqObj).then(resp => {
                res.json({ "status": true, "msg": "Bank Statemnet Uploaded SuceesFully", data: ResponseData});
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
})

module.exports = router;

