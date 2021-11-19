const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
var pdf = require('html-pdf');
const config = require('../config/config')[process.env.NODE_ENV || "development"];
//var userService = require('./services/userService');
var configService = require('../services/configService');
const aws = require('aws-sdk');
var env = require('dotenv').config();

const s3 = new aws.S3({
	  accessKeyId: env.parsed.ACCESS_kEY_ID.split('_')[1],
      secretAccessKey:env.parsed.SECRET_KEY_ID.split('_')[1],
      Bucket: env.parsed.BUCKET_NAME.split('_')[1],
})
var common = {};

common.genHash = function(pass) {
    // console.log('pass',pass);
    return new Promise((resolve, reject)=> {
		bcrypt.hash(pass, null, null, function(err, hash) {
            // console.log('err',err);
            // console.log('hash',hash);
            if(err) return reject(err);
	        resolve(hash); 
	    });
	})
};

common.compareHash = function(pass, userPass) {
    // console.log('pass',pass);
    // console.log('userPass',userPass);
    return new Promise((resolve, reject)=> {
        bcrypt.compare(pass, userPass, function(err, res) {
            // console.log('err',err);
            // console.log('res',res);
            if(err || res==false) return reject(err);
		    resolve('success');
		});
	})
};

var transporter = nodemailer.createTransport('smtps://'+config.mailer.id+':'+config.mailer.password+'@smtp.gmail.com');
common.sendMail = function(req, attachment) {

	return new Promise((resolve, reject)=> {

		var mailOptions = {
		    from: '"Aaryaa" <'+config.mailer.id+'>',
		    to: req.to,
		    subject: req.subject,
		    html: req.html
		};
		if (attachment) {
			mailOptions['attachments'] = [{filename: 'invoice.pdf',path:attachment.path,contentType: 'application/pdf'}]
		}

		transporter.sendMail(mailOptions, function(err, res){
	    	if(err || res==false) return reject(err);
		    resolve(res);
		});
	})
};

common.fileUpload = function(files, path){
	return new Promise((resolve, reject)=> {
		fs.readFile(files.file.path, function (err, data) {
		  	var newPath = path;
		  	fs.writeFile(newPath, data, function (err) {
		  		if(err){ return reject(err); }
		    	resolve("done");
		  	});
		});
	})
};

common.createPdf = function(req, option) {
	return new Promise((resolve, reject)=> {
		
		pdf.create(req, option).toStream(function(err, stream){
                // console.log("toMailId", toMailId);
                if(err){
                	return reject(err);
                }else{
					let fileName = new Date().getTime();
                    pdfPath =stream.pipe(fs.createWriteStream('./pdf/'+fileName+'.pdf'));
                    console.log('file path',pdfPath.path);
                    if(pdfPath){
                    	 //console.log("pdfPath", pdfPath);
						//  return configService.findAll({}).then(result => {
						// 	console.log('config data', result[0]);
						// 	let credentials = result[0];
						// 	//s3 upload code here
						// 	 s3 = new aws.S3({
						// 	  accessKeyId: credentials.accessKeyId,
						// 	  secretAccessKey: credentials.secretAccessKey,
						// 	  Bucket: credentials.bucket
						// 	});

							// s3.createBucket(function () {
							// 	let Bucket_Path = 'https://aryaa-filecontianer-dev.s3.ap-south-1.amazonaws.com/fileuploads/';
							// 	//Where you want to store your file
							// 	var ResponseData = [];
							 
							// 	//pdfPath.map((item) => {
							// 	var params = {
							// 	//   Bucket: credentials.bucket,
							// 	//   Key: item.originalname,
							// 	//   Body: item.buffer,
							// 	Key: fileName.toString(),
							// 	Body: stream,
							// 	Bucket: credentials.bucket,
							// 	ContentType: 'application/pdf',
							// 	  ACL: credentials.acl
							// };
							const params = {
								Key: fileName.toString()+'.pdf',
								Body: stream,
								Bucket: 'aryaa-filecontianer-dev',
								ContentType: 'application/pdf',
								ACL: "public-read"
							};
							s3.upload(params, (err, file) => {
											if (err) {
												console.log(err, 'err');
											}
											console.log(file, 'res s3 path');
											file['attachment_path'] = pdfPath;
											resolve(file)
										});
								//});
							//})
						// })
						 
						
                       
                    }
                }

            });
	})
}

module.exports = common;