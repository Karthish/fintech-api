const os = require('os');
var config = {};


////////////////////////////////////////////////////////////////////
 process.env.NODE_ENV = "dev";
   // process.env.NODE_ENV = "test";
// process.env.NODE_ENV = "uat"
/////////////////////////////////////////////////////////////////////

config.dev = {
	db : 'mongodb://localhost:27017/fintech-dev',
	host : "http://localhost",
    node_port : 8870,
	mailer : {
		id: '',
		password: ''
	}	
};

config.test = {
	db : 'mongodb://52.66.163.16:3366/cable-pay-qa',
	host : "http://52.66.163.16",
	node_port : 8871, 
	mailer : {
		id: '',
		password: ''
	}	 
};

module.exports = config;
