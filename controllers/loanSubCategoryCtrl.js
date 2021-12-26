var loanSubCategoryService = require('../services/loanSubCategoryService');

var loanSubCategoryCtrl = {};

loanSubCategoryCtrl.addNewLoanSubCategory = (req, res) => {
    return loanSubCategoryService.create(req.body).then(resp => {
        res.send({
            status: true,
            msg: "Loan subcategory added successfully",
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

loanSubCategoryCtrl.findLoanSubCategory = (req, res) => {
    return loanSubCategoryService.findAll(req.body).then(resp => {
        res.send({
            status: true,
            msg: "Loan subcategory details found",
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

module.exports = loanSubCategoryCtrl