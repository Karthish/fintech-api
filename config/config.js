const os = require('os');
var config = {};


////////////////////////////////////////////////////////////////////
 process.env.NODE_ENV = "dev";
   // process.env.NODE_ENV = "test";
// process.env.NODE_ENV = "uat"
/////////////////////////////////////////////////////////////////////

config.dev = {
	db : 'mongodb+srv://admin:admin@cluster0.pvsbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
	host : "http://localhost",
    node_port : 8870,
	mailer : {
		id: 'maplestreetfinserv@gmail.com',
		password: 'Lazyboys@123'
	},
	karza:{
		auth_key: 'FQdEGtWHuHV4GebM',
		app_type: 'application/json',
		consent: 'Y'
	},
	fileuploads3: {
		secretAccessKey: "xxxxxx",
  		accessKeyId: "yyyyyyy",
  		region: 'ap-south-1',
		bucket: 'xxxxyyyyy',
		acl: 'xyxyxy'
	},
	aadhar: {
		CONSENT_API: 'https://testapi.karza.in/v3/aadhaar-consent',
		OTP_VERIFY_API: 'https://testapi.karza.in/v3/get-aadhaar-otp',
		GET_AADHAR_FILE_API: 'https://testapi.karza.in/v3/get-aadhaar-file'
	},
	pan: {
		VERIFICATION_API : 'https://testapi.karza.in/v3/pan-profile',
		PAN_AADHAR_PROFILE_API : 'https://testapi.karza.in/v3/pan-aadhaar-profile'
	}  	
};

config.test = {
	db : 'mongodb+srv://admin:admin@cluster0.pvsbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
	host : "http://52.66.163.16",
	node_port : 8871, 
	mailer : {
		id: '',
		password: ''
	}	 
};

module.exports = config;
