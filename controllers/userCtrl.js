var userService = require("../services/userService");
var common = require("../common/common.js");
var jwt = require("jsonwebtoken");
var random = require("randomstring");
var randomize = require("randomatic");
var request = require("request");
var config = require("../config/config")[process.env.NODE_ENV || "dev"];
var pdf = require('html-pdf');
var bankService = require('../services/bankService');
var userMaster = {};
console.log('dirname', __dirname + './');
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
                    "Content-Type": `${config.karza.app_type}`,
                    "x-karza-key": `${config.karza.auth_key}`,
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
                    "Content-Type": `${config.karza.app_type}`,
                    "x-karza-key": `${config.karza.auth_key}`,
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
                                "Content-Type": `${config.karza.app_type}`,
                                "x-karza-key": `${config.karza.auth_key}`,
                            },
                            body: {
                                consent: "Y",
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
    let currentTime = new Date().getTime().toString().substr(0, 10);
    let caseId = randomize("0", 6);

    var options = {
        method: "POST",
        url: `${config.aadhar.CONSENT_API}`,
        headers: {
            "Content-Type": `${config.karza.app_type}`,
            "x-karza-key": `${config.karza.auth_key}`,
        },
        body: {
            ipAddress: "12.12.12.12",
            userAgent:
                "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
            consent: "Y",
            name: reqObj.pan_name ? reqObj.pan_name : 'testUser',
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
        if (consentResp) {
            setTimeout(() => {
                var options = {
                    method: "POST",
                    url: `${config.aadhar.OTP_VERIFY_API}`,
                    headers: {
                        "Content-Type": `${config.karza.app_type}`,
                        "x-karza-key": `${config.karza.auth_key}`,
                    },
                    body: {
                        consent: "Y",
                        aadhaarNo: req.body.aadhar_no,
                        accessKey: consentResp.result.accessKey,
                        clientData: {caseId: caseId},
                    },
                    json: true,
                };

                console.log(
                    "+++++++++++++++++++++++++ aadhaar-OTP generation request obj ++++++++++++++++++++++++++++++"
                );
                console.log(options.body);
                request(options, function (error, response, body) {
                    if (error) {
                        console.log("OTP Generation Error", error);
                        res.send({
                            status: false,
                            msg: error,
                        });
                    } else {
                        console.log(
                            "+++++++++++++++++++++++++ aadhaar-OTP generation response obj ++++++++++++++++++++++++++++++"
                        );
                        console.log(body);
                        let response = body;
                        if (
                            response["statusCode"] == "101" ||
                            response["statusCode"] == 101
                        ) {
                            res.send({
                                status: true,
                                msg: "OTP generated successfully",
                                data: response,
                            });
                        } else {
                            res.send({
                                status: false,
                                msg: "Invalide request details",
                                data: response,
                            });
                        }
                    }
                });
            }, 3000);
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
        url: `${config.aadhar.GET_AADHAR_FILE_API}`,
        headers: {
            "Content-Type": `${config.karza.app_type}`,
            "x-karza-key": `${config.karza.auth_key}`,
        },
        body: {
            consent: `${config.karza.consent}`,
            otp: req.body.otp,
            shareCode: shareCode,
            accessKey: req.body.accessKey,
            clientData: {
                caseId: req.body.caseId,
            },
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


            let currentTime = new Date().getTime().toString().substr(0, 10);
            let caseId = randomize("0", 6);

            var options = {
                method: "POST",
                url: `${config.aadhar.CONSENT_API}`,
                headers: {
                    "Content-Type": `${config.karza.app_type}`,
                    "x-karza-key": `${config.karza.auth_key}`,
                },
                body: {
                    ipAddress: "12.12.12.12",
                    userAgent:
                        "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
                    consent: "Y",
                    name: req.body.name ? req.body.name : 'testUser',
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
                if (consentResp) {
                    var options = {
                        method: "POST",
                       // url: `${config.pan.PAN_AADHAR_LINK_STATUS}`,
                        url: `${config.pan.VERIFICATION_API}`,
                        headers: {
                            "Content-Type": `${config.karza.app_type}`,
                            "x-karza-key": `${config.karza.auth_key}`,
                        },
                        body: {
                            consent: "Y",
                            aadhaarLastFour: req.body.aadhar_no.substring(req.body.aadhar_no.length - 4),
                            pan: req.body.pan_no
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
                    res.send({status: false, msg: err.message})
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

userMaster.getBankDetails = (req, res) => {
    return bankService.findOne({_id: req.body.bank_ref_id}).then(result => {
        res.send({
            status: true,
            msg: "Bank details",
            data: result,
        });
    }, err => {
        res.send({status: false, msg: err.message})
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

    let token;
    var options = {
        method: "POST",
        url: "https://api.earlysalary.com/uat/esapi/generateToken",
        headers: {
            "Content-Type": `${config.karza.app_type}`

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
                    setTimeout(() => {
                        return userService
                            .getUserById({_id: req.body.id})
                            .then(
                                (result) => {
                                    userData = result;
                                    getUserProfileData(userData, token, res)
                                    // let request = {
                                    //     mobilenumber: userData.mobile_no,
                                    //     profile: {
                                    //         firstname: userData.aadhar_details.name.split(" ")[0],
                                    //         lastname: userData.aadhar_details.name.split(" ")[1],
                                    //         dob: userData.aadhar_details.dob,
                                    //         gender: userData.aadhar_details.gender == 'M' ? 'Male' : 'Female',
                                    //         emailid: userData.email_id,
                                    //         profession: userData.professional_type,
                                    //         address1: userData.aadhar_details.address.combinedAddress,
                                    //         pincode: userData.aadhar_details.address.pincode,
                                    //         finance: {
                                    //             pan: userData.pan_no
                                    //         },
                                    //         employeedetails: {
                                    //             officepincode: '',
                                    //             salary: userData.monthly_income
                                    //         }
                                    //     }
                                    // }

                                    // var options = {
                                    //     method: "POST",
                                    //     url: "https://api.socialworth.in/betaProfileIngestion/profile-ingestion",
                                    //     headers: {
                                    //         "Content-Type": `${config.karza.app_type}`,
                                    //         "token": `${token}`

                                    //     },
                                    //     body:
                                    //         {
                                    //             mobilenumber: 9952538003, //requried
                                    //             profile: {
                                    //                 firstname: "Ramanathan",  // required
                                    //                 lastname: "Alagappan", //required
                                    //                 dob: "1992-07-02", //requried
                                    //                 gender: "Male", // required
                                    //                 emailid: "rampsg007@gmail.com", //requried
                                    //                 profession: "salaried", //required
                                    //                 address1: "B4 1E,Gowtham ABC Avenue,Peelamedu", //requried
                                    //                 address2: "Coimbatore ",
                                    //                 city: "Coimbatore ",
                                    //                 state: "Tamilnadu",
                                    //                 pincode: 641006, //requried
                                    //                 maritalstatus: "Single",
                                    //                 addresstype: "Self-Owned",
                                    //                 fathername: "vijay kumar agarwal",
                                    //                 mothername: "mina agarwal"
                                    //             },
                                    //             finance: {
                                    //                 pan: "AMBPN4511G"
                                    //             },
                                    //             employeedetails: {
                                    //                 employername: "kuya technologies Pvt Ltd",
                                    //                 officeaddress: "kuya technologies Pvt Ltd coimbatore",
                                    //                 officepincode: 560008, //requried
                                    //                 salary: 180000, //requried
                                    //                 dateofjoining: "2020-07-21",
                                    //                 designation: "HR ACCOUNTS"
                                    //             },
                                    //             product: {
                                    //                 type: "3"
                                    //             }

                                    //         },
                                    //     json: true,
                                    // };

                                    // console.log(
                                    //     "+++++++++++++++++++++++++ Esalary request obj ++++++++++++++++++++++++++++++"
                                    // );
                                    // console.log(options);
                                    // request(options, function (error, response, body) {
                                    //     if (error) {
                                    //         console.log("Esalay Error", error);
                                    //         res.send({
                                    //             status: false,
                                    //             msg: error,
                                    //         });
                                    //         return
                                    //     } else {
                                    //         console.log(
                                    //             "+++++++++++++++++++++++++ Esalay  response obj ++++++++++++++++++++++++++++++"
                                    //         );
                                    //         console.log(body);
                                    //         let response = body;
                                    //     }
                                    // })

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
                    }, 1000)
                }
            }
        }
    })

}

function getUserProfileData(userData, token, res) {
  console.log('getUserProfileData')
                          let request = {
                                        mobilenumber: userData.mobile_no,
                                        profile: {
                                            firstname: userData.aadhar_details.name.split(" ")[0],
                                            lastname: userData.aadhar_details.name.split(" ")[1],
                                            dob: userData.aadhar_details.dob,
                                            gender: userData.aadhar_details.gender == 'M' ? 'Male' : 'Female',
                                            emailid: userData.email_id,
                                            profession: userData.professional_type,
                                            address1: userData.aadhar_details.address.combinedAddress,
                                            pincode: userData.aadhar_details.address.pincode,
                                            finance: {
                                                pan: userData.pan_no
                                            },
                                            employeedetails: {
                                                officepincode: '',
                                                salary: userData.monthly_income
                                            }
                                        }
                                    }

                                   
  var options = {
    method: "POST",
    url: "https://api.socialworth.in/betaProfileIngestion/profile-ingestion",
    headers: {
      "Content-Type": `${config.karza.app_type}`,
      "token": `${token}`
      
    },
    body: request,
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
      console.log(
        "+++++++++++++++++++++++++ Esalay  response obj ++++++++++++++++++++++++++++++"
      );
      console.log(body);
      let response = body;
      res.send({
        status: true,
        msg: "Early salary response",
        data: response
      })
    }
  })

 
}

module.exports = userMaster;
