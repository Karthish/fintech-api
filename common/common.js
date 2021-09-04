const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
var pdf = require('html-pdf');
const config = require('../config/config')[process.env.NODE_ENV || "development"];

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
		    from: '"CablePay" <'+config.mailer.id+'>',
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
                    pdfPath =stream.pipe(fs.createWriteStream('invoices/'+new Date().getTime()+'.pdf'));
                    console.log('file path',pdfPath.path);
                    if(pdfPath){
                    	// console.log("pdfPath", pdfPath);
                        resolve(pdfPath)
                    }
                }

            });
	})
}

module.exports = common;