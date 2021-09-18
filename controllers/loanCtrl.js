var loanService = require('../services/loanService');

var loanCtrl = {};

loanCtrl.addNewLoan = (req, res) => {
    return loanService.create(req.body).then(resp => {
        res.send({
            status: true,
            msg: "Loan added successfully",
            data: resp
        })
    }, err => {
        res.send({
            status: false,
            msg: "Invalid Request",
            
        })
    }).catch(err => {
        res.send({
            status: false,
            msg: "something went wrong"
        })
    })
};

loanCtrl.findLoans = (req, res) => {
    return loanService.findAll({}).then(resp => {
        res.send({
            status: true,
            msg: "Loan details found",
            data: resp
        })
    }, err => {
        res.send({
            status: false,
            msg: "Invalid request"
        })
    }).catch(err => {
        res.send({
            status: false,
            msg: "Something Went Wrong"
        })
    })
}

module.exports = loanCtrl