const express = require('express');
var router = express.Router();

var request = require('request');
var multer = require('multer');
var upload = multer({dest:'./uploads/'});

var user = require('./controllers/userCtrl.js');
var loan  = require('./controllers/loanCtrl');
var config = require('./controllers/configCtrl');
var bank = require('./controllers/bankCtrl');
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
router.post('/singleFile', upload.single('file'), (req, res) => {
  try {
    res.send(req.file);
  }catch(err) {
    res.send(400);
  }
});

router.post('/multipleFile', upload.array('files', 4) , (req, res) =>{
  try {
    res.send(req.files);
} catch(error) {
      console.log(error);
       res.send(400);
}
});


//Bank details API call
router.post('/bank/create', bank.addConfig);
router.get('/bank/list', bank.getConfig);
router.post('/bank/update', user.updateBankDetails);


module.exports = router;

