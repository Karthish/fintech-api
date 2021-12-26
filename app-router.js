const express = require('express');
var router = express.Router();
var request = require('request');
var multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

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
    console.log('file map item', item)
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
              console.log('uploaded files', ResponseData);
              if(ResponseData.length == file.length){
                var reqObj = {};
                reqObj['id'] =  req.params.id;
                reqObj['payslip_documents'] = ResponseData;
                reqObj['target'] = 'payslipUpload';
                reqObj['current_page'] = 'cust-details';
                reqObj['next_page'] = 'loan-offer-list';
                console.log('reqObj for update', reqObj);
                userService.findByIdAndUpdate(reqObj).then(resp => {
                res.json({ "status": true, "msg": "File Uploaded SuceesFully", data: ResponseData});
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

let postEsignUpload = multer({storage: storage}).fields([{ name: 'cancelledcheck', maxCount: 1 }, { name: 'empId', maxCount: 1 },{name: 'bankstatement', maxCount: 1}]);
var bucketFileLength = [];
//const upload = multer({ dest: './uploads/' });
//const cpUpload = upload.fields([{ name: 'cancelledcheck', maxCount: 1 }, { name: 'empId', maxCount: 2 },{name: 'bankstatement', maxCount: 1}]);
router.post('/post/esign', postEsignUpload, function (req, res, next) {
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
console.log('uploaded files',req.files);
console.log('additional data',req.body.eSingData);
var fileArray = [];
var uplodedFilelength = [];

if(req.files.cancelledcheck.length ){
  req.files.cancelledcheck.forEach(function(file){
    uplodedFilelength.push(file)
  })
}

if(req.files && req.files.empId && req.files.empId.length) {
  req.files.empId.forEach(function(file){
    uplodedFilelength.push(file)
  })
}

if(req.files && req.files.bankstatement && req.files.bankstatement.length) {
  req.files.bankstatement.forEach(function(file){
    uplodedFilelength.push(file)
  })
}
  if(req.files.cancelledcheck.length){
     uploadfilesinbucket(req.files.cancelledcheck, 'cancelledCheck', req, uplodedFilelength, res);
  }

  if(req.files && req.files.empId && req.files.empId.length) {
    uploadfilesinbucket(req.files.empId, 'empId', req, uplodedFilelength, res);

  }
  let bankStatement = (req.files? (req.files.bankstatement ? (req.files.bankstatement.length ? req.files.bankstatement.length : '') : '') : '');
  if(bankStatement) {
    uploadfilesinbucket(bankStatement,'bankStatement',req, uplodedFilelength, res);

  }
})

function uploadfilesinbucket(files, flag, req, uplodedFilelength, res){
  console.log('uploadfilesinbucket',files);
 // console.log('flag',flag);

  return configService.findAll({}).then(result => {
   // console.log('config data', result[0]);
    let credentials = result[0];
    let s3bucket = new aws.S3({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      Bucket: credentials.bucket
    });
    var result;
  s3bucket.createBucket(function () {
        var ResponseData = [];
        files.map((item) => {
         // console.log('item', item); 
          bucketFileLength.push(item)
        var params = {
          Bucket: credentials.bucket,
          Key: item.originalname,
          Body: item.buffer,
          ACL: credentials.acl
    };
  s3bucket.upload(params, function (err, data) {
    //console.log('uploaded data',data)
          if (err) {
           res.json({ "status": false, "msg": err});
          }else{
              ResponseData.push(data);
             
              var reqObj = {};
              reqObj['id'] =  req.body.id;
              reqObj['id'] =  "619d2ed60261fc51f88c60f9";
              if(flag == 'cancelledCheck'){
                reqObj['cancelled_cheque_doc'] = ResponseData;
              }
              
              if(flag == 'empId'){
                reqObj['employee_id_doc'] = ResponseData;
              }

              if(flag == 'bankStatement'){
                reqObj['bank_statement_doc'] = ResponseData;
              }
              
              reqObj['target'] = 'postEsign';
              reqObj['current_page'] = 'post-esign';
              reqObj['next_page'] = 'dashboard';
              //console.log('reqObj for update', reqObj);
              userService.findByIdAndUpdate(reqObj).then(resp => {
                if(uplodedFilelength.length == bucketFileLength.length){
                  console.log(uplodedFilelength.length, bucketFileLength.length)
                  res.send({ status:true, msg:"Files updated successfully", data:ResponseData})
                }
              }, err => {
                res.send({ status:false, msg:err})
              }).catch(err => {
                res.send({ status:false, msg:err})
              })
              
            }
         });
       });
     });
 }, err => {
   //res.send({ "status":false, msg:"Invalid config details"})
   console.log('err', err)
 }).catch(err => {
  console.log('catch err', err)
   //res.send({ "status":false, msg:"Something went wrong"})
 })
}

module.exports = router;

