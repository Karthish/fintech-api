const express = require('express');
var router = express.Router();

var request = require('request');

//var upload = multer({dest:'./uploads/'});

var user = require('./controllers/userCtrl.js');
var loan  = require('./controllers/loanCtrl');
var config = require('./controllers/configCtrl');
var bank = require('./controllers/bankCtrl');

var configService = require('./services/configService');
var multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

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

//Testing purpose
router.delete('/user/:id', user.findByIdAndRemove);

//File Upload API
// router.post('/singleFile', upload.single('file'), (req, res) => {
//   try {
//     res.send(req.file);
//   }catch(err) {
//     res.send(400);
//   }
// });

// router.post('/multipleFile', upload.array('files', 4) , (req, res) =>{
//   try {
//     res.send(req.files);
// } catch(error) {
//       console.log(error);
//        res.send(400);
// }
// });

let credentials;
function getConfigData() {
    return configService.findAll({}).then(result => {
        console.log('config data', result[2]);
        return credentials = result[2];
              aws.config.update({
                  secretAccessKey: credentials.secretAccessKey,
                  accessKeyId: credentials.accessKeyId,
                  region: credentials.region
                 });
                if(credentials){
                  upload();
                }
               
       
    }, err => {
        console.log('config err', err)
        
    }).catch(err => {
        console.log('config catch err', err)
    })

    return credentials;
}
var data = getConfigData();

console.log('data', data);
const s3 = new aws.S3();
/* To validate your file type */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'pdf') {
   cb(null, true);
  } else {
   cb(new Error('Wrong file type, only upload PDF file !'), 
   false);
  }
 };


  // const upload =  multer({
  //   fileFilter: fileFilter,
  //   storage: multerS3({
  //    acl: credentials.acl,
  //    s3,
  //    bucket: credentials.bucket,
  //    key: function(req, file, cb) {
  //      /*I'm using Date.now() to make sure my file has a unique name*/
  //      console.log('req', req);
  //      //console.log('file', file);
  
  //      req.file = Date.now() + file.originalname;
  //      cb(null, Date.now() + file.originalname);
  //     }
  //    })
  //   });
 
 


//Bank details API call
router.post('/bank/create', bank.addConfig);
router.get('/bank/list', bank.getConfig);
router.post('/bank/update', user.updateBankDetails);
//router.post('/payslip/upload',  user.uploadPayslip);

// router.post('/payslip/upload', upload.array('payslip', 1), (req, res) => {
//   /* This will be th 8e response sent from the backend to the frontend */
//   console.log('payslip response', req)
//   res.send({ image: req.file });

//  });


module.exports = router;

