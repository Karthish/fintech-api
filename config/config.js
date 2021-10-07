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
		id: '',
		password: ''
	},
	karza:{
		auth_key: 'FQdEGtWHuHV4GebM',
		app_type: 'application/json',
		consent: 'Y'
	},
	fileuploads3: {
		secretAccessKey: "mSAW8KqON+mFaoi+e5dbjYj7mHSXVu+j1ZL3h63q",
  		accessKeyId: "AKIAXE4CJVZ7GASIP5UX",
  		region: 'ap-south-1',
		bucket: 'aryaa-filecontianer-dev',
		acl: 'public-read'
	},
	aadhar: {
		CONSENT_API: 'https://testapi.karza.in/v3/aadhaar-consent',
		OTP_VERIFY_API: 'https://testapi.karza.in/v3/get-aadhaar-otp',
	},
	pan: {
		VERIFICATION_API : 'https://testapi.karza.in/v2/pan'
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
