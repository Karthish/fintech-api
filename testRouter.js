const express = require('express');
var router = express.Router();
var user = require('./controllers/userCtrl.js');


router.get('/tmproute', user.testFunction);



module.exports = router;

