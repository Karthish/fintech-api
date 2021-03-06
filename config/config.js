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
		auth_key: 'xxxxxx',
		app_type: 'yzyzyzyz',
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
		PAN_AADHAR_PROFILE_API : 'https://testapi.karza.in/v3/pan-aadhaar-profile',
		PAN_AADHAR_LINK_STATUS : "https://testapi.karza.in/v3/pan-aadhaar-link"
	},
	epf: {
		EPF_GET_OTP: 'https://testapi.karza.in/v2/epf-get-otp',
		EPF_GET_PASSBOOK: 'https://testapi.karza.in/v2/epf-get-passbook',
	}  	
};


module.exports = config;
