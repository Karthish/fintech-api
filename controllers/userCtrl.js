var userService = require("../services/userService");
var common = require("../common/common.js");
var jwt = require("jsonwebtoken");
var random = require("randomstring");
var randomize = require("randomatic");
var moment = require('moment'); // require
moment().format(); 
var request = require("request");
var config = require("../config/config")[process.env.NODE_ENV || "dev"];
var pdf = require('html-pdf');
var bankService = require('../services/bankService');
var configService = require('../services/configService');
var userMaster = {};
console.log('dirname', __dirname + './');
let credentials;
function getConfig() {
    return configService.findAll({}).then(result => {
                         
                           credentials = result[0];
                           console.log('credentials', result[0]);
                       
                      })
                  }

  

getConfig();

userMaster.testFunction = function (req, res) {
    //res.send("working fine");
    var html = `<html>
              <head>
              <title>Sanction Letter</title></head>
              <body>
              <button class="btn btn-success btn-block">E-Sign PDF</button>
<div id="sanctionLetter_pdfData" class="p-5" style="font-size: 1.2rem;font-family: 'regular_font', sans-serif!important;">
    <div class="date mb-3">31-10-2021</div>
    <ul class="address" style="list-style-type: none;padding: 0;">
        <li>Company Name</li>
        <li>Address Line</li>
        <li>Company City, state, zipcode</li>
    </ul>
    <h4 class="mt-3" style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">Congralations!</h4>
    <p>
        We are pleased to inform you that, after evaluating your request, Bank Name has approved the following term loan 
        subject to conditions detailed below:
    </p>
    <table class="mt-3 mb-3">
        <tbody>
            <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">BORROWER</h4></td>
                <td>COMPANY NAME</td>
            </tr>
            <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">AMOUNT</h4></td>
                <td>$</td>
            </tr>
            <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">RATE (%)</h4></td>
                <td>%</td>
            </tr>
            <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">LATE CHARGES (%)</h4></td>
                <td>5.00</td>
            </tr>
            <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">DEFAULT RATE (%)</h4></td>
                <td>2.00</td>
            </tr>
            <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">PREPAYMENT PENALTY (%)</h4></td>
                <td>3.00</td>
            </tr>
            <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">REPAYMENT</h4></td>
                <td>
                    This term loan will be repaid by 59 consecutive monthly payments of principal and interest of 
                    $, with a final payment (60) of $plus any accured interest and/or late charges accumulated, 
                    if applicable.
                </td>
            </tr>
            <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">PERSONAL GUARANTEE</h4></td>
                <td>
                    <h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">INCLUDE DETAILS AS IN APPLICATION</h4>
                </td>
            </tr>
        </tbody>
    </table>
    <p>
        This approval is subject to additional validations and delivery of business documents. In addition, if you have 
        an existing commercial credit relationship with us the approval will be subject to verification of payment and 
        financial performance of those credit facilities.
    </p>
    <p>
        This commitment is subject to the preparation, execution, and delivery of documentation in the form and substance 
        satisfactory to Bank Name, in which, in addition to substantially incorporating the terms and conditions set forth above,
        other terms and conditions will be included as necessary for this type of transaction.
    </p>
    <p>Please evidence your approval of the foregoing by consenting this commitment letter.</p>
    <h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">This offer expires in 10 days.</h4>

    <div class="d-flex justify-content-between mt-4">
        <div>
            concent
        </div>
        <div>
            Date
        </div>
    </div>
</div>
              </body>
              </html>`;

    // pdf.create(html).toStream((err, stream) => {

    //   if (err) {

    //     console.error(err);
    //     res.status(500);
    //     res.end(JSON.stringify(err));

    //     return;
    //   }

    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'attachment; filename=test-file.pdf;');

    //   stream.pipe(res);
    // });


//   pdf.create(html).toFile('./pdf/invoice.pdf', function(err, file) {
//     if (err) {
//       console.log('file error',err);
//     }else {
//       console.log('file path', file);
//       let obj = {};
//       obj['subject'] = 'file attachment';
//       obj['html'] = 'file attachment';
//       obj['to'] = 'nagaraj.info6@gmail.com';

//       return common.sendMail(obj,file.filename).then(response => {
//         console.log('email response', response);
//         res.send({status: true, msg:"Invoice document send to the given email ID "})
//       })
//     }
// });

    return common.createPdf(html, '').then(response => {
        console.log('uploaded file path', response);
        let filePath = response
        let obj = {};
        obj['subject'] = 'file attachment';
        obj['html'] = 'file attachment';
        obj['to'] = 'nagaraj.info6@gmail.com';

        return common.sendMail(obj, filePath).then(response => {
            console.log('email response', response);
            res.send({status: true, msg: "Invoice document send to the given email ID "})
        })
    })

};

userMaster.panVerification = function (req, res) {
    console.log('enter here', req.body);
    let reqObj = req.body;
    if (!reqObj.pan_no) {
        res.send({
            status: false, msg: "PAN Number is required", data: {}
        })
        return
    }
    let userObj;
    return userService.findOne({pan_no: reqObj.pan_no}).then(result => {
        res.send({status: false, msg: "PAN details already exists", data: result})
    }, err => {
        var data = JSON.stringify({
            pan: reqObj.pan_no,
            consent: `${config.karza.consent}`,
        });

        console.log(
            "+++++++++++++++++++++++++ PAN request obj ++++++++++++++++++++++++++++++"
        );
        console.log(data);
        request.post(
            {
                url: `${config.pan.VERIFICATION_API}`,
                headers: {
                    "Content-Type": `${credentials.app_type}`,
                    "x-karza-key": `${credentials.auth_key}`,
                },
                body: data,
            },
            function (err, httpResponse, body) {
                console.log("error:", err);
                //console.error('httpResponse:', httpResponse);
                let panResult = JSON.parse(body);
                res.send({
                    status: true,
                    data: panResult,
                    msg: "pan response"
                })
                //console.log("panResult type:", typeof(panResult));
                // console.log("panResult :", JSON.stringify(panResult));
                // if (panResult.statusCode == 101 ||  panResult.statusCode == '101') {
                //     let records = panResult.result.profileMatch;
                //     req.body.current_page = "pan-verification";
                //     req.body.next_page = "aadhar-verification";
                //     req.body.pan_name = panResult.result.name;
                //    // req.body.target = "panDetails";
                //     req.body.email_id = panResult.result.emailId ? panResult.result.emailId : null ;
                //     req.body.mobile_no = panResult.result.mobileNo ? panResult.result.mobileNo : null;

                //     return userService
                //       .createUser(req.body)
                //       .then(
                //         (result) => {
                //           res.send({
                //             status: true,
                //             msg: "PAN details updated",
                //             data: result,
                //           });
                //         },
                //         (err) => {
                //           res.send({
                //             status: false,
                //             msg: "Invalid input details",
                //           });
                //         }
                //       )
                //       .catch((err) => {
                //         res.send({
                //           status: false,
                //           msg: "Unexpected Error",
                //         });
                //       });
                //     // let filterData = records.filter(function(record){

                //     //     if(record["parameter"] == 'name') {
                //     //         return true
                //     //     }else {
                //     //         return false
                //     //     }
                //     // })
                //     // if(filterData.length){
                //     //   if(filterData[0].matchScore >= 0.5){
                //     //       //res.send({ })
                //     //       req.body.current_page = "pan-verification";
                //     //       req.body.next_page = "aadhar-verification";
                //     //       req.body.pan_name = panResult.result.name;
                //     //      // req.body.target = "panDetails";
                //     //       req.body.email_id = panResult.result.emailId;
                //     //       req.body.mobile_no = panResult.result.mobileNo;

                //     //       return userService
                //     //         .createUser(req.body)
                //     //         .then(
                //     //           (result) => {
                //     //             res.send({
                //     //               status: true,
                //     //               msg: "PAN details updated",
                //     //               data: result,
                //     //             });
                //     //           },
                //     //           (err) => {
                //     //             res.send({
                //     //               status: false,
                //     //               msg: "Invalid input details",
                //     //             });
                //     //           }
                //     //         )
                //     //         .catch((err) => {
                //     //           res.send({
                //     //             status: false,
                //     //             msg: "Unexpected Error",
                //     //           });
                //     //         });
                //       // }else {
                //       //     res.send({
                //       //         status:false,
                //       //         msg:"Given name is incorrect"
                //       //     })
                //       // }
                //     // }

                // } else {
                //   res.send({
                //     status: false,
                //     msg: "Given PAN details are not matched with Aadhar",
                //     statusCode: body["status-code"],
                //   });
                // }
            }
        );
    }).catch(err => {
        res.send({status: false, msg: 'Unexpected Error', data: {}})
    })

};

userMaster.panVerification_v1 = (req, res) => {
    console.log("req Obj", req.body);
    var userObj;
    var monthYearOfBirth;
    return userService.getUserById({_id: req.body.id}).then(
        (result) => {
            userObj = result;
            let dob = userObj.aadhar_details.dob;
            if (dob) {
                let splitDob = dob.split('-');
                let year = splitDob[0];
                let month = splitDob[1];
                monthYearOfBirth = month + '-' + year;
            }
            let currentTime = new Date().getTime().toString().substr(0, 10);
            let caseId = randomize("0", 6);
            var options = {
                method: "POST",
                url: `${config.aadhar.CONSENT_API}`,
                headers: {
                    "Content-Type": `${credentials.app_type}`,
                    "x-karza-key": `${credentials.auth_key}`,
                },
                body: {
                    ipAddress: "12.12.12.12",
                    userAgent:
                        "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
                    consent: "Y",
                    name: userObj.name,
                    consentTime: currentTime,
                    consentText: "Consent accepted",
                    clientData: {caseId: caseId},
                },
                json: true,
            };

            console.log(
                "+++++++++++++++++++++++++ aadhaar-consent request obj ++++++++++++++++++++++++++++++"
            );
            console.log(options.body);
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                let consentResp = body;
                console.log(
                    "+++++++++++++++++++++++++ aadhaar-consent Response obj ++++++++++++++++++++++++++++++"
                );
                console.log("consentResp", consentResp);
                if (consentResp.statusCode == 101) {
                    setTimeout(() => {
                        var options = {
                            method: "POST",
                            url: `${config.pan.PAN_AADHAR_PROFILE_API}`,
                            headers: {
                                "Content-Type": `${credentials.app_type}`,
                                "x-karza-key": `${credentials.auth_key}`,
                            },
                            body: {
                                consent: `${credentials.consent}`,
                                aadhaar: userObj.aadhar_no,
                                pan: req.body.pan_no,
                                monthYearOfBirth: monthYearOfBirth,
                                accessKey: consentResp.result.accessKey,
                                clientData: {caseId: consentResp.clientData.caseId},
                            },
                            json: true,
                        };

                        console.log(
                            "+++++++++++++++++++++++++ aadhaar-PAN request obj ++++++++++++++++++++++++++++++"
                        );
                        console.log(options.body);
                        request(options, function (error, response, body) {
                            if (error) {
                                console.log(" aadhaar-PAN Error", error);
                                res.send({
                                    status: false,
                                    msg: error,
                                });
                            } else {
                                console.log(
                                    "+++++++++++++++++++++++++  aadhaar-PAN response obj ++++++++++++++++++++++++++++++"
                                );
                                console.log(body);
                                let response = body;
                                if (
                                    response["statusCode"] == "101" ||
                                    response["statusCode"] == 101
                                ) {
                                    req.body.current_page = "pan-verification";
                                    req.body.next_page = "cust-details";
                                    //req.body.pan_name = req.body.name;
                                    req.body.pan_no = req.body.pan_no;
                                    req.body.email_id = response.result.emailId;
                                    req.body.mobile_no = response.result.mobileNo;
                                    req.body.target = "panDetails";

                                    return userService
                                        .findByIdAndUpdate(req.body)
                                        .then(
                                            (result) => {
                                                res.send({
                                                    status: true,
                                                    msg: "PAN details updated",
                                                    data: result,
                                                });
                                            },
                                            (err) => {
                                                res.send({
                                                    status: false,
                                                    msg: "Invalid input details",
                                                });
                                            }
                                        )
                                        .catch((err) => {
                                            res.send({
                                                status: false,
                                                msg: "Unexpected Error",
                                            });
                                        });
                                } else {
                                    res.send({
                                        status: false,
                                        msg: response
                                    });
                                }
                            }
                        });
                    }, 3000);
                }
            });
        }, err => {
            res.send({status: false, msg: "Inavlid request details"})
        }).catch(err => {
        res.send({status: false, msg: "Something went wrong"})
    })
};

userMaster.aadharVerification = function (req, res) {
    let reqObj = req.body;
    console.log("req Obj", reqObj);
    if (!reqObj.aadhar_no) {
        res.send({status: false, msg: "Aadhar number required"});
        return
    }
    //return userService.findOne({_id:reqObj.id}).then(result => {
    let currentTime = new Date().getTime().toString().substring(0, 10);
   // let currentTime = new Date().getTime()/1000;

    console.log('current time',Math.floor(currentTime).toString());

    let currentDate = new Date().getTime();
    let timestamp = Math.floor( currentDate / 1000 );

    console.log("timestamp", timestamp)

    
    //UTC Timestamp coversion
    let d1 = new Date();
    var d2 = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds()).getTime().toString();
    var utcTime = Math.floor(d2 / 1000);
    console.log('utc Time', utcTime)

    //Epoch seconds
    var utcEpochSeconds = new Date().getTime() - parseInt((new Date().getTimezoneOffset() * 6000));
    var timestr = utcEpochSeconds.toString().substr(0, 10);
    
    console.log('utcEpochSeconds', utcEpochSeconds)
    console.log('timestr', timestr)

    // var b = moment.utc();
    // var stamp = b.valueOf();
    // console.log('stamp', stamp)

    let caseId = randomize("0", 6);

    var options = {
        method: "POST",
        url: 'https://testapi.karza.in/v3/aadhaar-xml/otp',
        headers: {
            "Content-Type": `${credentials.app_type}`,
            "x-karza-key": `${credentials.auth_key}`,
        },
        body: {
            consent: "Y",
            aadhaarNo: reqObj.aadhar_no
        },
        json: true,
    };

    console.log(
        "+++++++++++++++++++++++++ aadhaar-consent request obj ++++++++++++++++++++++++++++++"
    );
    console.log(options.body);
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let consentResp = body;
        console.log(
            "+++++++++++++++++++++++++ aadhaar-consent Response obj ++++++++++++++++++++++++++++++"
        );
        console.log("consentResp", consentResp);
        if(consentResp.statusCode != 101){
            res.send({
                status: false,
                msg: consentResp.statusMessage
            })
            return
        }
        if (consentResp.statusCode == 101) {
            // setTimeout(() => {
            //     var options = {
            //         method: "POST",
            //         url: `${config.aadhar.OTP_VERIFY_API}`,
            //         headers: {
            //             "Content-Type": `${config.karza.app_type}`,
            //             "x-karza-key": `${config.karza.auth_key}`,
            //         },
            //         body: {
            //             consent: "Y",
            //             aadhaarNo: req.body.aadhar_no,
            //             accessKey: consentResp.result.accessKey,
            //             clientData: {caseId: caseId},
            //         },
            //         json: true,
            //     };

            //     console.log(
            //         "+++++++++++++++++++++++++ aadhaar-OTP generation request obj ++++++++++++++++++++++++++++++"
            //     );
            //     console.log(options.body);
            //     request(options, function (error, response, body) {
            //         if (error) {
            //             console.log("OTP Generation Error", error);
            //             res.send({
            //                 status: false,
            //                 msg: error,
            //             });
            //         } else {
            //             console.log(
            //                 "+++++++++++++++++++++++++ aadhaar-OTP generation response obj ++++++++++++++++++++++++++++++"
            //             );
            //             console.log(body);
            //             let response = body;
            //             if (
            //                 response["statusCode"] == "101" ||
            //                 response["statusCode"] == 101
            //             ) {
            //                 res.send({
            //                     status: true,
            //                     msg: "OTP generated successfully",
            //                     data: response,
            //                 });
            //             } else {
            //                 res.send({
            //                     status: false,
            //                     msg: "Invalide request details",
            //                     data: response,
            //                 });
            //             }
            //         }
            //     });
            // }, 3000);

            res.send({
                status:true,
                msg: "otp generated",
                data: consentResp
            })
        }
    });
    // },
    //  err => {res.send({status:false, msg: "Inavalid request"})})
    //  .catch((err) => {
    //   res.send({
    //     status: true,
    //     data: {},
    //     msg: "somthing went wrong",
    //   });
    // });
};


userMaster.aadharOTPVerification = function (req, res) {
    let aadharResponseObj;
    let shareCode = randomize("0", 4);
    console.log("aadharOTPVerification req obj:", req.body);
    var options = {
        method: "POST",
        url: 'https://testapi.karza.in/v3/aadhaar-xml/file',
        headers: {
            "Content-Type": `${credentials.app_type}`,
            "x-karza-key": `${credentials.auth_key}`,
        },
        body: {
            consent: `${config.karza.consent}`,
            otp: req.body.otp,
            requestId: req.body.requestId
        },
        json: true,
    };

    console.log(
        "+++++++++++++++++++++++++ aadhaar download request obj ++++++++++++++++++++++++++++++"
    );
    console.log(options.body);
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(
            "+++++++++++++++++++++++++ aadhaar download response obj ++++++++++++++++++++++++++++++"
        );
        console.log(body);
        aadharResponseObj = body;
        if (aadharResponseObj.statusCode == 101) {


            let currentTime = new Date().getTime().toString().substring(0, 10);
            let caseId = randomize("0", 6);

            var options = {
                method: "POST",
                url: `${config.aadhar.CONSENT_API}`,
                headers: {
                    "Content-Type": `${credentials.app_type}`,
                    "x-karza-key": `${credentials.auth_key}`,
                },
                body: {
                    ipAddress: "12.12.12.12",
                    userAgent:
                        "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
                    consent: "Y",
                    name: req.body.name ? req.body.name : 'testUser',
                    consentTime: 1654355317,
                    consentText: "Consent accepted",
                    clientData: {caseId: caseId},
                },
                json: true,
            };

            console.log(
                "+++++++++++++++++++++++++ aadhaar-consent request obj ++++++++++++++++++++++++++++++"
            );
            console.log(options.body);
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                let consentResp = body;
                console.log(
                    "+++++++++++++++++++++++++ aadhaar-consent Response obj ++++++++++++++++++++++++++++++"
                );
                console.log("consentResp", consentResp);
                if (consentResp) {
                    var options = {
                        method: "POST",
                       // url: `${config.pan.PAN_AADHAR_LINK_STATUS}`,
                        url: `${config.pan.VERIFICATION_API}`,
                        headers: {
                            "Content-Type": `${credentials.app_type}`,
                            "x-karza-key": `${credentials.auth_key}`,
                        },
                        body: {
                            consent: "Y",
                            aadhaarLastFour: req.body.aadhar_no.substring(req.body.aadhar_no.length - 4),
                            pan: req.body.pan_no,
                            name:req.body.name
                        },
                        json: true,
                    };

                    console.log(
                        "+++++++++++++++++++++++++ PAN aadhaar link status  request obj ++++++++++++++++++++++++++++++"
                    );
                    console.log(options.body);
                    request(options, function (error, response, body) {

                        if ((body["statusCode"] == "101" ||
                            body["statusCode"] == 101) && body.result.aadhaarMatch) {
                            console.log(
                                "+++++++++++++++++++++++++ PAN aadhaar link status response obj ++++++++++++++++++++++++++++++"
                            );
                            console.log(body);
                            let response = body;


                            //create user obj

                            req.body.name = aadharResponseObj.result.dataFromAadhaar.name;
                            // req.body.email_id = aadharResponseObj.result.dataFromAadhaar.emailHash;
                            //req.body.mobile_no = aadharResponseObj.result.dataFromAadhaar.mobileHash;
                            req.body.current_page = "aadhar-verification";
                            req.body.next_page = "cust-details";
                            req.body.target = "aadhar-details";
                            req.body.aadhar_details = aadharResponseObj.result.dataFromAadhaar;
                            return userService.createUser(req.body).then(
                                (result) => {
                                    res.send({
                                        status: true,
                                        msg: "User created successfully",
                                        data: result,
                                    });
                                },
                                (err) => {
                                    res.send({
                                        status: false,
                                        msg: "Invalid input details",
                                    });
                                }
                            )
                                .catch((err) => {
                                    res.send({
                                        status: false,
                                        msg: "Unexpected Error",
                                    });
                                });
                        } else {
                            console.log("PAN-AADHAAR LINK VERIFICATION SERVICE THROWN ERROR", error);
                            res.send({
                                status: false,
                                msg: "Error occurred while getting the PAN-AADHAAR link details or Aadhaar-PAN not linked",
                            });
                        }
                    });
                }
            });

        } else {
            res.send({
                status: false,
                msg: aadharResponseObj,
            });
        }
    });
};

userMaster.login = function (req, res) {
    var user = req.body;
    var output = {};
    userService
        .findOne({username: user.username, is_deleted: false})
        .then((resp) => {
            output = resp;
            return common.compareHash(user.password, resp.secret);
        })
        .then((resp) => {
            // var token = jwt.sign({username: output.username }, process.env.Key, {expiresIn: '1min'} );
            res.send({
                status: true,
                data: output,
            });
        })
        .catch((err) => {
            res.send({
                status: false,
                msg: "Invalid Username/Password",
            });
        });
};

userMaster.adminSignup = function (req, res) {
    var user = req.body.secret;
    // console.log('signup admin',user);

    common
        .genHash(user)
        .then(
            (result) => {
                // console.log('output hash',output);
                res.send({
                    status: true,
                    msg: "Hash key generation successfully",
                    data: result.id,
                });
            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Mismatched Key",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "No Records Found",
            });
        });
};

userMaster.createUser = function (req, res) {
    console.log("enter ctrl");
    req["username"] = "admin";
    req["email_id"] = "admin@gmail.com";
    req["secret"] = "admin";
    return userService.findOneAndUpdate(req).then(
        (resp) => {
            console.log("response", resp);
            res.send({
                status: true,
                msg: "User added successfully",
                data: resp,
            });
        },
        (err) => {
            res.send({
                status: false,
                msg: "Invalid user details",
                data: {},
            });
        }
    );
};

userMaster.getUser = (req, res) => {
    let id = req.params.id;
    return userService
        .getUserById({_id: id})
        .then(
            (result) => {
                res.send({
                    status: true,
                    msg: "User details found",
                    data: result,
                });
            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid user details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });
};

userMaster.findByIdAndRemove = (req, res) => {
    let id = req.params.id;
    return userService
        .findByIdAndRemove({_id: id})
        .then(
            (result) => {
                res.send({
                    status: true,
                    msg: "User details removed successfully",
                    data: result,
                });
            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid user details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });
};

userMaster.updateUserDetails = (req, res) => {
    req.body.target = "customerDetails";
    return userService
        .findByIdAndUpdate(req.body)
        .then(
            (result) => {
                res.send({
                    status: true,
                    msg: "User details updated",
                    data: result,
                });
            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid input details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });
};

userMaster.updateBankDetails = (req, res) => {
    req.body.target = "bankDetails";
    req.body.current_page = 'loan-offer-list';
    req.body.next_page = 'loan-offer-details';
    return userService
        .findByIdAndUpdate(req.body)
        .then(
            (result) => {

                return bankService.findOne({_id: req.body.bank_ref_id}).then(result => {
                    res.send({
                        status: true,
                        msg: "Bank details updated",
                        data: result,
                    });
                }, err => {
                    res.send({status: false, msg: err})
                }).catch((err) => {
                    res.send({
                        status: false,
                        msg: "Unexpected Error",
                    });
                });

            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid input details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });
};

userMaster.updateTargetPage = (req, res) => {
    req.body.target = "post-eSign-page";
    req.body.current_page = 'loan-offer-details';
    req.body.next_page = 'post-esign-process';
    return userService
        .findByIdAndUpdate(req.body)
        .then(
            (result) => {

                res.send({
                    status: true,
                    msg: "User details updated",
                    data: result,
                });
            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid input details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });
};

userMaster.getBankDetails = (req, res) => {
    return bankService.findOne({_id: req.body.bank_ref_id}).then(result => {
        res.send({
            status: true,
            msg: "Bank details",
            data: result,
        });
    }, err => {
        res.send({status: false, msg: err})
    }).catch((err) => {
        res.send({
            status: false,
            msg: "Unexpected Error",
        });
    });
}

userMaster.addOrUpdateReference = (req, res) => {
    req.body.target = "addReference";
    return userService
        .addOrUpdateReference(req.body)
        .then(
            (result) => {
                res.send({
                    status: true,
                    msg: "User References updated",
                    //data: result,
                });
            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid input details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });
};

userMaster.updateDetails = (req, res) => {
    let id = req.params.id;
    req.body.id = id;
    req.body.target = "updateUser";
    req.body.email_id = 'nagaraj-update@gmail.com';

    return userService
        .findByIdAndUpdate(req.body)
        .then(
            (result) => {
                res.send({
                    status: true,
                    msg: "User details updated",
                    data: result,
                });
            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid input details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });
};

userMaster.sanctionPdfDownload = (req, res) => {
    let id = req.body.id;
    //let id = "617ec47b8adea25838111388";
    let userData = null;
    return userService
        .getUserById({_id: id})
        .then(
            (result) => {
                userData = result;
                console.log('getUserById result', result)
                if (result.is_esigned || result.sanction_letter_url) {
                    console.log('if')
                    let pdfUrl = result.sanction_letter_singned_url ? result.sanction_letter_singned_url : result.sanction_letter_url;
                    res.send({
                        status: true,
                        msg: "sanction letter details",
                        data: pdfUrl,
                    });
                } else {
                    console.log('else')
                    var html = `<!doctype html> <html lang="en">
          <head>
          <title>Sanction Letter</title></head>
          <body>
          <div id="sanctionLetter_pdfData" class="p-5" style="font-size: 1.2rem;font-family: 'regular_font', sans-serif!important;padding:20px">
          <div class="date mb-3">${new Date().toLocaleDateString()}</div>
          <ul class="address" style="list-style-type: none;padding: 0;">
              <li>Company Name:  ${userData.organization_name ? userData.organization_name : '-'}</li>
              <li>Address Line: ${(userData.aadhar_details ? (userData.aadhar_details.address.combinedAddress ? userData.aadhar_details.address.combinedAddress : '-') : '-')}</li>
          </ul>
          <h4 class="mt-3" style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">Congralations!</h4>
          <p>
              We are pleased to inform you that, after evaluating your request, Bank Name has approved the following term loan 
              subject to conditions detailed below:
          </p>
          <table class="mt-3 mb-3">
              <tbody>
              <tr>
                 <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">BORROWER: </h4></td>
                  <td>${userData.name ? userData.name : '-'}</td>
              </tr>
               <tr>
                  <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">COMPANY NAME: </h4></td>
                  <td> -</td>
                </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">RATE (%)</h4></td>
                      <td>%</td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">LATE CHARGES (%)</h4></td>
                      <td>5.00</td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">DEFAULT RATE (%)</h4></td>
                      <td>2.00</td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">PREPAYMENT PENALTY (%)</h4></td>
                      <td>3.00</td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">REPAYMENT</h4></td>
                      <td>
                          This term loan will be repaid by 59 consecutive monthly payments of principal and interest of 
                          $, with a final payment (60) of $plus any accured interest and/or late charges accumulated, 
                          if applicable.
                      </td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">PERSONAL GUARANTEE</h4></td>
                      <td>
                          <h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">INCLUDE DETAILS AS IN APPLICATION</h4>
                      </td>
                  </tr>
              </tbody>
          </table>
          <p>
              This approval is subject to additional validations and delivery of business documents. In addition, if you have 
              an existing commercial credit relationship with us the approval will be subject to verification of payment and 
              financial performance of those credit facilities.
          </p>
          <p>
              This commitment is subject to the preparation, execution, and delivery of documentation in the form and substance 
              satisfactory to Bank Name, in which, in addition to substantially incorporating the terms and conditions set forth above,
              other terms and conditions will be included as necessary for this type of transaction.
          </p>
          <p>Please evidence your approval of the foregoing by consenting this commitment letter.</p>
          <h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">This offer expires in 10 days.</h4>

          <div class="d-flex justify-content-between mt-4">
              <div>
                  concent
              </div>
              <div>
                  Date
              </div>
          </div>
          </div>
          </body>
          </html>`;

                    console.log('enter here')
                    return common.createPdf(html, '').then(response => {
                        console.log('uploaded file path', response);
                        let filePath = response.Location;
                        // res.send({
                        //   status: true,
                        //   msg: "sanction letter details shared",
                        //   data: filePath
                        // })
                        var reqObj = {};
                        reqObj['id'] = id;
                        reqObj['sanction_letter_url'] = filePath;
                        reqObj['target'] = 'sanction-letter-upload';
                        return userService.findByIdAndUpdate(reqObj).then(resp => {
                            res.json({"status": true, "Message": "Sanction Letter details", data: filePath});
                        }, err => {
                            res.send({"status": false, msg: err.message});
                        }).catch(err => {
                            res.send({"status": false, msg: err.message});
                        })
                    }, err => {
                        res.send({status: false, msg: err.message})
                    }).catch(err => {
                        res.send({status: false, msg: err.message})
                    })
                }

            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid user details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });

};


userMaster.sanctionAttachment = (req, res) => {
    console.log('request deta', req.body);
    let id = req.body.id;
    //let id = "617ec47b8adea25838111388";
    let userData = null;
    return userService
        .getUserById({_id: id})
        .then(
            (result) => {
                userData = result;
                console.log('getUserById result', result)
                //if(result.is_esigned || result.sanction_letter_url){
                //console.log('if')
                //let pdfUrl = result.sanction_letter_singned_url ? result.sanction_letter_singned_url : result.sanction_letter_url;
                // res.send({
                //   status: true,
                //   msg: "sanction letter details",
                //   data: pdfUrl,
                // });

                console.log('else')
                var html = `<!doctype html> <html lang="en">
          <head>
          <title>Sanction Letter</title></head>
          <body>
          <div id="sanctionLetter_pdfData" class="p-5" style="font-size: 1.2rem;font-family: 'regular_font', sans-serif!important;padding:20px">
          <div class="date mb-3">${new Date().toLocaleDateString()}</div>
          <ul class="address" style="list-style-type: none;padding: 0;">
              <li>Company Name:  ${userData.organization_name ? userData.organization_name : '-'}</li>
              <li>Address Line: ${(userData.aadhar_details ? (userData.aadhar_details.address.combinedAddress ? userData.aadhar_details.address.combinedAddress : '-') : '-')}</li>
          </ul>
          <h4 class="mt-3" style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">Congralations!</h4>
          <p>
              We are pleased to inform you that, after evaluating your request, Bank Name has approved the following term loan 
              subject to conditions detailed below:
          </p>
          <table class="mt-3 mb-3">
              <tbody>
              <tr>
                <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">BORROWER: </h4></td>
                <td>${userData.name ? userData.name : '-'}</td>
              </tr>
              <tr>
                 <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">COMPANY NAME: </h4></td>
                  <td> -</td>
              </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">RATE (%)</h4></td>
                      <td>%</td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">LATE CHARGES (%)</h4></td>
                      <td>5.00</td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">DEFAULT RATE (%)</h4></td>
                      <td>2.00</td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">PREPAYMENT PENALTY (%)</h4></td>
                      <td>3.00</td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">REPAYMENT</h4></td>
                      <td>
                          This term loan will be repaid by 59 consecutive monthly payments of principal and interest of 
                          $, with a final payment (60) of $plus any accured interest and/or late charges accumulated, 
                          if applicable.
                      </td>
                  </tr>
                  <tr>
                      <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">PERSONAL GUARANTEE</h4></td>
                      <td>
                          <h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">INCLUDE DETAILS AS IN APPLICATION</h4>
                      </td>
                  </tr>
              </tbody>
          </table>
          <p>
              This approval is subject to additional validations and delivery of business documents. In addition, if you have 
              an existing commercial credit relationship with us the approval will be subject to verification of payment and 
              financial performance of those credit facilities.
          </p>
          <p>
              This commitment is subject to the preparation, execution, and delivery of documentation in the form and substance 
              satisfactory to Bank Name, in which, in addition to substantially incorporating the terms and conditions set forth above,
              other terms and conditions will be included as necessary for this type of transaction.
          </p>
          <p>Please evidence your approval of the foregoing by consenting this commitment letter.</p>
          <h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">This offer expires in 10 days.</h4>

          <div class="d-flex justify-content-between mt-4">
              <div>
                  concent
              </div>
              <div>
                  Date
              </div>
          </div>
          </div>
          </body>
          </html>`;


                return common.createPdf(html, '').then(response => {
                    console.log('uploaded file path', response);
                    let filePath = response.Location;
                    let attchment_path = response.attachment_path;
                    // res.send({
                    //   status: true,
                    //   msg: "sanction letter details shared",
                    //   data: filePath
                    // })
                    var reqObj = {};
                    reqObj['id'] = id;
                    reqObj['sanction_letter_url'] = filePath;
                    reqObj['target'] = 'sanction-letter-upload';
                    return userService.findByIdAndUpdate(reqObj).then(resp => {
                        let obj = {};
                        obj['subject'] = 'Sanction Letter Attachment';
                        obj['html'] = 'Please find your sanction letter attachment below';
                        obj['to'] = req.body.email;

                        return common.sendMail(obj, attchment_path).then(response => {
                            console.log('email response', response);
                            res.send({status: true, msg: "Invoice document send to the given email ID", data: filePath})
                        })
                        // res.json({ "status": true, "Message": "Sanction Letter details", data: filePath});
                    }, err => {
                        res.send({"status": false, msg: err.message});
                    }).catch(err => {
                        res.send({"status": false, msg: err.message});
                    })
                }, err => {
                    res.send({status: false, msg: err.message})
                }).catch(err => {
                    res.send({status: false, msg: err.message})
                })
                //}

            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid user details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });

};

userMaster.esignVerification = (req, res) => {
    let id = req.body.id;
    //let id = "617ec47b8adea25838111388";
    let userData = null;
    return userService
        .getUserById({_id: id})
        .then(
            (result) => {
                userData = result;
                var html = `<!doctype html> <html lang="en">
        <head>
        <title>Sanction Letter</title></head>
        <body>
        <div id="sanctionLetter_pdfData" class="p-5" style="font-size: 1.2rem;font-family: 'regular_font', sans-serif!important;padding:20px">
        <div class="date mb-3">${new Date().toLocaleDateString()}</div>
        <ul class="address" style="list-style-type: none;padding: 0;">
            <li>Company Name:  ${userData.organization_name ? userData.organization_name : '-'}</li>
            <li>Address Line: ${(userData.aadhar_details ? (userData.aadhar_details.address.combinedAddress ? userData.aadhar_details.address.combinedAddress : '-') : '-')}</li>
            </ul>
        <h4 class="mt-3" style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">Congralations!</h4>
        <p>
            We are pleased to inform you that, after evaluating your request, Bank Name has approved the following term loan 
            subject to conditions detailed below:
        </p>
        <table class="mt-3 mb-3">
            <tbody>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">BORROWER: </h4></td>
                    <td>${userData.name ? userData.name : '-'}</td>
                </tr>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">COMPANY NAME: </h4></td>
                    <td> -</td>
                </tr>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">AMOUNT</h4></td>
                    <td>$ ${userData.desired_fund_amount ? userData.desired_fund_amount : '-'}</td>
                </tr>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">RATE (%)</h4></td>
                    <td>%</td>
                </tr>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">LATE CHARGES (%)</h4></td>
                    <td>5.00</td>
                </tr>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">DEFAULT RATE (%)</h4></td>
                    <td>2.00</td>
                </tr>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">PREPAYMENT PENALTY (%)</h4></td>
                    <td>3.00</td>
                </tr>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">REPAYMENT</h4></td>
                    <td>
                        This term loan will be repaid by 59 consecutive monthly payments of principal and interest of 
                        $, with a final payment (60) of $plus any accured interest and/or late charges accumulated, 
                        if applicable.
                    </td>
                </tr>
                <tr>
                    <td style="min-width: 25vw;"><h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">PERSONAL GUARANTEE</h4></td>
                    <td>
                        <h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">INCLUDE DETAILS AS IN APPLICATION</h4>
                    </td>
                </tr>
            </tbody>
        </table>
        <p>
            This approval is subject to additional validations and delivery of business documents. In addition, if you have 
            an existing commercial credit relationship with us the approval will be subject to verification of payment and 
            financial performance of those credit facilities.
        </p>
        <p>
            This commitment is subject to the preparation, execution, and delivery of documentation in the form and substance 
            satisfactory to Bank Name, in which, in addition to substantially incorporating the terms and conditions set forth above,
            other terms and conditions will be included as necessary for this type of transaction.
        </p>
        <p>Please evidence your approval of the foregoing by consenting this commitment letter.</p>
        <h4 style="font-size: 1.1rem;font-family: 'semi_bold', sans-serif!important;">This offer expires in 10 days.</h4>

        <div class="d-flex justify-content-between mt-4">
            <div>
                <p>Digitally Signed by: ${userData.name ? userData.name : '-'} </p>
                <p>Reason: 'Approving the document' </p>
                <p>Location: 'Bangloare, India' </p>
                <p>ContactInfo: '-' </p>
                <p>Date: ${new Date().toLocaleDateString()} </p>
            </div>
           
        </div>
        </div>
        </body>
        </html>`;

                return common.createPdf(html, '').then(response => {
                    console.log('uploaded file path', response);
                    let filePath = response.Location;
                    // res.send({
                    //   status: true,
                    //   msg: "sanction letter details shared",
                    //   data: filePath
                    // })
                    var reqObj = {};
                    reqObj['id'] = id;
                    reqObj['sanction_letter_singned_url'] = filePath;
                    reqObj['is_esigned'] = true;
                    reqObj['target'] = 'sanction-letter-esign';
                    return userService.findByIdAndUpdate(reqObj).then(resp => {
                        res.json({"status": true, "msg": "E-Sign verification completed successfully", data: filePath});
                    }, err => {
                        res.send({"status": false, msg: err.message});
                    }).catch(err => {
                        res.send({"status": false, msg: err.message});
                    })
                }, err => {
                    res.send({status: false, msg: err.message})
                }).catch(err => {
                    res.send({status: false, msg: err.message})
                })

            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid user details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });

};

userMaster.updateDashboard = (req, res) => {
    req.body.target = "dashboard";
    return userService.findByIdAndUpdate(req.body).then(result => {
        res.send({status: true, msg: "dashboard details updated successfully", data: result});
    }, err => {
        res.send({status: false, msg: "Invalid Input"})
    }).catch((err) => {
        res.send({status: false, msg: "Unexpected Error",})
    })
}
userMaster.getDashboard = (req, res) => {
    let id = req.params.id;
    return userService
        .getUserById({_id: id})
        .then(
            (result) => {
                res.send({
                    status: true,
                    msg: "User details found",
                    data: result,
                });
            },
            (err) => {
                res.send({
                    status: false,
                    msg: "Invalid user details",
                });
            }
        )
        .catch((err) => {
            res.send({
                status: false,
                msg: "Unexpected Error",
            });
        });
}


userMaster.generateToken = (req, res) => {
    console.log('enter here')
    // let tokenReqObj = {
    //   "username":"AryaaoneUser",
    //   "password":"Ary@@One#fd$23@df#32",
    //   "applicationName": "WEB"
    //   }

    //req.body.id = req.body.id ? req.body.id : "6220ede1014e060ee134b0e4";
    req.body.cust_ref_id = req.body.cust_ref_id ? req.body.cust_ref_id : "6251183ad0abce74b8c627da";
    let token;
    var options = {
        method: "POST",
        url: "https://api.earlysalary.com/uat/esapi/generateToken",
        headers: {
            "Content-Type": `${credentials.app_type}`

        },
        body: {
            username: "AryaaoneUser",
            password: "Ary@@One#fd$23@df#32",
            applicationName: "WEB"
        },
        json: true,
    };

    console.log(
        "+++++++++++++++++++++++++ Esalary Token request obj ++++++++++++++++++++++++++++++"
    );
    console.log(options.body);
    request(options, function (error, response, body) {
        if (error) {
            console.log("Esalay Error", error);
            res.send({
                status: false,
                msg: error,
            });
            return
        } else {
            console.log(
                "+++++++++++++++++++++++++ Esalay Token response obj ++++++++++++++++++++++++++++++"
            );
            console.log(body);
            let response = body;
            if (
                response["statusCode"] == "200" ||
                response["statusCode"] == 200
            ) {
                token = response["token"];
                if (token) {
                    // setTimeout(() => {
                        return userService
                            .getUserById({_id: req.body.cust_ref_id})
                            .then(
                                (result) => {
                                    userData = result;
                                    userData['cust_ref_id'] = req.body.cust_ref_id;
                                    userData['bank_ref_id'] = req.body.bank_ref_id;
                                   // getUserProfileData(userData, token, res);
                                    generateUANOtp(userData, token, res);
                                 
                                }, err => {
                                    res.send({
                                        status: false,
                                        msg: "User details not found"
                                    })
                                }).catch(err => {
                                res.send({
                                    status: false,
                                    msg: "Something Went Wrong"
                                })
                            });
                    // }, 1000)
                }
            }
        }
    })

}

userMaster.earlySalaryLoanStatus = (req, res) => {
  //let token = generateUserToken();
  //console.log('user Token',token )
  let userData;
    let customerLoanReqObj = {};
    customerLoanReqObj['cust_ref_id'] = req.body.cust_ref_id;
    
    return bankService.findCustomerLoanDetails(customerLoanReqObj)
      .then(
          result => {
              userData = result;
              console.log('userdata in loan sanction', userData);
              //let token = generateUserToken();
              if(!userData.loan_details.customerid ) {
                  res.send({
                      status: false,
                      msg: userData.loan_details.reason,
                      data: userData
                  })
                  return
              }
              let token;
              var options = {
                  method: "POST",
                  url: "https://api.earlysalary.com/uat/esapi/generateToken",
                  headers: {
                      "Content-Type": `${credentials.app_type}`
            
                  },
                  body: {
                      username: "AryaaoneUser",
                      password: "Ary@@One#fd$23@df#32",
                      applicationName: "WEB"
                  },
                  json: true,
              };
            
              console.log(
                  "+++++++++++++++++++++++++ Esalary Token request obj ++++++++++++++++++++++++++++++"
              );
              console.log(options.body);
              request(options, function (error, response, body) {
                if (error) {
                    console.log("Esalay Error", error);
                    res.send({
                        status: false,
                        msg: error,
                    });
                    return
                } else {
                    console.log(
                        "+++++++++++++++++++++++++ Esalay Token response obj ++++++++++++++++++++++++++++++"
                    );
                    console.log(body);
                    let response = body;
                    if (
                        response["statusCode"] == "200" ||
                        response["statusCode"] == 200
                    ) {
                        token = response["token"];
                        if(token){
                          let statusAPIUrl = 'https://api.socialworth.in/peopleStrong/fetchcuststatus';
                          let customerId = (userData ? (userData.loan_details ? (userData.loan_details.customerid ? userData.loan_details.customerid : '') : ''): '');
                          let custRefNoword =  randomize("0", 25);
                          
                          var options = {
                            method: "POST",
                            url: statusAPIUrl,
                            headers: {
                                      "Content-Type": `${credentials.app_type}`,
                                      "token": token
                                    },
                            body: {
                                customerId: customerId,
                                custRefNoword: custRefNoword
                            },
                            json: true,
                         };
          
                         console.log(
                          "+++++++++++++++++++++++++ Esalary Status request obj ++++++++++++++++++++++++++++++"
                      );
                      console.log(options.body);
                      request(options, function (error, response, body) {
                          if (error) {
                              console.log("Esalay Error", error);
                              res.send({
                                  status: false,
                                  msg: error,
                              });
                              return
                          } else {
                              console.log(
                                  "+++++++++++++++++++++++++ Esalay Statud response obj ++++++++++++++++++++++++++++++"
                              );
                              console.log(body);
                              let response = body;
                              response['customer_details'] = userData;
                                  res.send({
                                    status: true,
                                    msg: "User Loan Application Details",
                                    data: response
                                  })
                              
                          }
                      })
          
                      }
                    }
                }
            })

           
          }, err => {
              res.send({
                  status: false,
                  msg: "User details not found"
              })
          }).catch(err => {
              res.send({
                  status: false,
                  msg: "Something Went Wrong"
              })
      });
}

userMaster.updateLoansanctionTest = (req, res) => {
    console.log('credentials', `${credentials.auth_key}`)
    let customerLoanReqObj = {
        cust_ref_id: '629f48c5e494de1f60331530',
        bank_ref_id: '6227408f45641b987885d8b4',
        mobilenumber: '9952538003',
        status: 'failure',
        statuscode: 107,
        customerid: 'null',
        reason: 'Service is not available at given pincodes 613205,0',
        product: '',
        sanctionLimit: '',
        responseDate: new Date(),
        inPrincipleLimit: 0,
        inPrincipleTenure: 0,
        loan_application_number: '09997261'
    }

    return bankService.updateCustomerLoanDetails(customerLoanReqObj).then(resp => {
        res.send({
            status:true,
            data: resp
        })
    }, err => {
        console.log('err', err);
        res.send({
            status:false,
            msg: eee
        })
    }).catch(e => {
        res.send({
            status:false,
            msg: e
        })
    })
}

function getUserProfileData(userData, token, UANResponse, res) {
  //console.log('getUserProfileData', userData)
  console.log('token data', token);
//   let firstDate = UANResponse.est_details[UANResponse.est_details.length - 1].doj_epf.split("-")[2];
//   console.log('firstDate', firstDate);
//   const d = new Date();
//   let year = d.getFullYear();
//   let yearOfExperience = year - firstDate;
//   console.log('yearOfExperience', yearOfExperience);
//console.log('getUserProfileData', userData)
console.log('UAN est_details',  UANResponse.result.est_details[0]);
console.log('UANResponse employee_details',  UANResponse.result.employee_details);


                          //dynamic Request from DB 
                          let dynamicRequestObj = {
                                        mobilenumber: +userData.mobile_no,
                                        profile: {
                                            firstname: userData.aadhar_details.name.split(" ")[0],
                                            lastname: userData.aadhar_details.name.split(" ")[1],
                                            dob: userData.aadhar_details.dob,
                                            gender: userData.aadhar_details.gender == 'M' ? 'Male' : 'Female',
                                            emailid: userData.email_id,
                                            profession: userData.professional_type,
                                            address1: userData.aadhar_details.address.combinedAddress,
                                            address2: userData.aadhar_details.address.splitAddress.street,
                                            city:  userData.aadhar_details.address.splitAddress.vtcName,
                                            state: userData.aadhar_details.address.splitAddress.state,
                                            pincode: +userData.aadhar_details.address.splitAddress.pincode,
                                            maritalstatus:  userData.marital_status,
                                            addresstype: userData.address_type, //"Self-Owned",
                                            fathername: UANResponse ? ( UANResponse.result? (UANResponse.result.employee_details ?  (UANResponse.result.employee_details.father_name ? UANResponse.result.employee_details.father_name: ''):''):''):'' ,
                                            mothername: userData.mothers_maiden_name,
                                            finance: {
                                                pan: userData.pan_no
                                            },
                                            employeedetails: {
                                                employername: userData.organization_name,
                                                officepincode: userData.office_pin_code,
                                                salary: +userData.monthly_income,
                                                officeaddress: UANResponse ? ( UANResponse.result.est_details[0]? (UANResponse.result.est_details[0].office?UANResponse.result.est_details[0].office: '') : '') : '',
                                                dateofjoining:  UANResponse ? ( UANResponse.result.est_details[0]? (UANResponse.result.est_details[0].doj_epf?UANResponse.result.est_details[0].doj_epf: '') : '') : '',
                                                designation: userData.designation,
                                                //yoe: yearOfExperience ?  yearOfExperience : 7,
                                                yoe: 10,
                                            },
                                            product: {
                                                type: "3"
                                                }
                                                
                                        }
                                    }

                                  
                                    console.log('dynamicRequestObj ', dynamicRequestObj)

                                   
  var options = {
    method: "POST",
    url: "https://api.socialworth.in/betaProfileIngestion/profile-ingestion",
    headers: {
              "Content-Type": `${credentials.app_type}`,
              "token": `${token}`
            },

         body: dynamicRequestObj,         
        json: true,
      };

  console.log(
    "+++++++++++++++++++++++++ Esalary request obj ++++++++++++++++++++++++++++++"
  );
  console.log(options);
  request(options, function (error, response, body) {
    if (error) {
      console.log("Esalay Error", error);
      res.send({
        status: false,
        msg: error,
      });
      return
   
    } else {
        let eSalaryResponse = null;
        let loanApplicationNumber = randomize("0", 8);
            console.log(
                "+++++++++++++++++++++++++ Esalay  response obj ++++++++++++++++++++++++++++++"
            );
            console.log(body);
             eSalaryResponse = body;

            let customerLoanReqObj = {};
            customerLoanReqObj['cust_ref_id'] = userData.cust_ref_id.toString();
            customerLoanReqObj['bank_ref_id'] = userData.bank_ref_id.toString();
            //customerLoanReqObj['loan_details'] = eSalaryResponse;
            customerLoanReqObj['mobilenumber'] = eSalaryResponse.mobilenumber ? eSalaryResponse.mobilenumber : '' ;
            customerLoanReqObj['status'] = eSalaryResponse.status ? eSalaryResponse.status : '' ;
            customerLoanReqObj['statuscode'] = eSalaryResponse.statuscode ? eSalaryResponse.statuscode : '' ;
            customerLoanReqObj['customerid'] = eSalaryResponse.customerid ? eSalaryResponse.customerid : '' ;
            customerLoanReqObj['reason'] = eSalaryResponse.reason ? eSalaryResponse.reason : '' ;
            customerLoanReqObj['product'] = eSalaryResponse.product ? eSalaryResponse.product : '' ;
            customerLoanReqObj['sanctionLimit'] = eSalaryResponse.sanctionLimit ? eSalaryResponse.sanctionLimit : '' ;
            customerLoanReqObj['responseDate'] = eSalaryResponse.responseDate ? new Date(eSalaryResponse.responseDate) : '' ;
            customerLoanReqObj['inPrincipleLimit'] = eSalaryResponse.inPrincipleLimit ? eSalaryResponse.inPrincipleLimit : '' ;
            customerLoanReqObj['inPrincipleTenure'] = eSalaryResponse.inPrincipleTenure ? eSalaryResponse.inPrincipleTenure : '' ;
            customerLoanReqObj['loan_application_number'] = loanApplicationNumber;
            let loanSanctionResponse = null;
            return bankService.findCustomerLoanDetails(customerLoanReqObj).then(resp => {
                //update customer loan details in loan sanction collection
                console.log('findCustomerLoanDetails success')
                return bankService.updateCustomerLoanDetails(customerLoanReqObj).then(resp => {
                    console.log('updateCustomerLoanDetails success');
                    loanSanctionResponse = resp;
                    let customerTblUpdateObj = {};
                    customerTblUpdateObj['id'] = resp.cust_ref_id.toString();
                    customerTblUpdateObj['target'] = "bankDetails";
                    customerTblUpdateObj['current_page'] = 'loan-offer-list';
                    customerTblUpdateObj['next_page'] = 'early-salary-dashboard';
                    customerTblUpdateObj['customer_ref_id'] = resp.cust_ref_id.toString();
                    customerTblUpdateObj['loan_sanction_ref_id'] = resp._id.toString();
                    customerTblUpdateObj['loan_application_number'] = loanApplicationNumber;
                    customerTblUpdateObj['bank_ref_id'] = userData['bank_ref_id'].toString();

                    //update customer collection start
                    return userService
                    .findByIdAndUpdate(customerTblUpdateObj)
                    .then(
                        (result) => {
                            console.log('update customer collection success')
                            res.send({
                                status: true,
                                msg: "Loan sanction details updated successfully",
                                data: eSalaryResponse
                            })
                        }, err => {
                            res.send({
                                status: false,
                                msg: 'Inavaid input details',
                            })
                        }).catch(err => {
                        res.send({
                            status: false,
                            msg: 'Something went wrong',
                        })
                    })
                    //update customer collection end
                }, err => {
                    res.send({
                        status: false,
                        msg: "Invalid input details"
                    })
                }).catch(err => {
                    res.send({
                        status: false,
                        msg: "Something went wrong"
                    })
                })
                //update customer loan details in loan sanction collection end

            }, err => {
                // error part on find customer loan details not exits

                //save customer loan details start
                console.log('else part save customer collection request', customerLoanReqObj)
                return bankService.createCustomerLoanDetails(customerLoanReqObj).then(resp => {
                    console.log('save customer collection scucess', resp)
                    let customerTblUpdateObj = {};
                    customerTblUpdateObj['id'] = userData.cust_ref_id.toString();
                    customerTblUpdateObj['target'] = "bankDetails";
                    customerTblUpdateObj['current_page'] = 'loan-offer-list';
                    customerTblUpdateObj['next_page'] = 'early-salary-dashboard';
                    customerTblUpdateObj['customer_ref_id'] =  userData.cust_ref_id.toString();
                    customerTblUpdateObj['loan_sanction_ref_id'] = resp._id.toString();
                    customerTblUpdateObj['loan_application_number'] = loanApplicationNumber;
                    customerTblUpdateObj['bank_ref_id'] = userData['bank_ref_id'].toString();

                    //customer collection update start
                    return userService.findByIdAndUpdate(customerTblUpdateObj).then(result => {
                        console.log('else part update customer collection request', result)
                        res.send({
                            status: true,
                            msg: "Loan sanction details updated successfully",
                            data: eSalaryResponse
                        })
                    }, err => {
                        res.send({
                            status: false,
                            msg: "Invalid input details"
                        })
                    }).catch(err => {
                        res.send({
                            status: false,
                            msg: "Something went wrong"
                        })
                    })
                    // update customer collection end
                }, err => {
                    res.send({
                        status: false,
                        msg: "Invalid input details"
                    })
                }).catch(err => {
                    res.send({
                        status: false,
                        msg: "Something went wrong"
                    })
                //save customer loan details end

            }).catch(err => {
                res.send({
                    status: false,
                    msg: "Something went wrong"
                })
            })
        })
    }
    
    //else part end
    })
    // request call end
 
}



function generateUANOtp(userData, token, res){
    var options = {
        method: "POST",
        url: "https://testapi.karza.in/v2/epf-get-otp",
        headers: {
            "Content-Type": `${credentials.app_type}`,
            "x-karza-key": `${credentials.auth_key}`

        },
        body: {
            "consent": "Y",
            "uan": "", //100946405415
            "mobile_no": userData.mobile_no //9952538003  userData.mobile_no
          },
        json: true,
    };

    console.log('UAN otp request obj', options);
    request(options, function (error, response, body) {
        if (error) {
            console.log("Esalay Error", error);
            res.send({
                status: false,
                msg: error,
            });
            return
        } else {
            console.log(
                "+++++++++++++++++++++++++ epf-get-otp response obj ++++++++++++++++++++++++++++++"
            );
            console.log(body);
            let response = body;
            if(response['status-code'] == 101 || response['status-code'] == "101"){
                response.token = token;
                res.send({
                    status: true,
                    msg: "UAN otp response",
                    data: response
                });
            }else {
                res.send({
                    status: false,
                    msg: "UAN otp response",
                    data: response
                });
            }
           
        }
    })
}

userMaster.uanOtpVerification = (req, res) => {
    let token = req.body.token ? req.body.token : '';
    //req.body.request_id = '';
    //req.body.otp = '';
    //req.body.cust_ref_id = '';
    console.log('Req body',req.body);

    var options = {
        method: "POST",
        url: "https://testapi.karza.in/v2/epf-get-passbook",
        headers: {
            "Content-Type": `${credentials.app_type}`,
            "x-karza-key": `${credentials.auth_key}`

        },
        body: {
            "request_id":  req.body.request_id,
            "otp": req.body.otp
          },
        json: true,
    };

    console.log('req options', options )
    request(options, function (error, response, body) {
        if (error) {
            console.log("Esalay Error", error);
            res.send({
                status: false,
                msg: error,
            });
            return
        } else {
            console.log(
                "+++++++++++++++++++++++++ epf-get-passbook response obj ++++++++++++++++++++++++++++++"
            );
            console.log('body',body);
           // console.log('body',body.result.est_details);
            let UANResponse = body;
            if(UANResponse['status'] == 503){
                res.send({
                    status: false,
                    msg: UANResponse.error,
                    data: {}
                })
                return
            }
            if(UANResponse['status-code'] != 503){
                return userService
                            .getUserById({_id: req.body.cust_ref_id})
                            .then(
                                (result) => {
                                    userData = result;
                                    userData['cust_ref_id'] = req.body.cust_ref_id;
                                    userData['bank_ref_id'] = req.body.bank_ref_id ? req.body.bank_ref_id : '' ;
                                    getUserProfileData(userData, token, UANResponse, res);
                                   // generateUANOtp(userData, token, res);
                                 
                                }, err => {
                                    res.send({
                                        status: false,
                                        msg: "User details not found"
                                    })
                                }).catch(err => {
                                res.send({
                                    status: false,
                                    msg: "Something Went Wrong"
                                })
                            });
            }else {
                res.send({
                    status: false,
                    msg: "UAN otp response",
                    data: response
                });
            }
        }
    })


}

module.exports = userMaster;
