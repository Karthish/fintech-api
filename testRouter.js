const express = require('express');
var router = express.Router();
var user = require('./controllers/userCtrl.js');

router.get('/healthCheck', (req, res) =>
  res.send('OK')
);
router.get('/tmproute', user.testFunction);



module.exports = router;

