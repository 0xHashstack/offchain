const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    loanId: {
        type: Number,
        required: true,
    },
    account: {
        type: String,
        required: true
    },
    loanMarket: {
        type: String,
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    collateralMarket: {
        type: String,
        required: true,
    },
    collateralAmount: {
        type: Number,
        required: true
    },
    commitment: {
        type: String,
        required: true
    },
    cdr: {
        type: Number,
        required: true
    },
    debtCategory: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    isSwapped: {
        type: Boolean,
        default: false,
        required: true
    },
    currentMarket: {
        type: String
    }, 
    currentAmount: {
        type: Number,
    }
});


const Loan = mongoose.model('Loan', LoanSchema);

module.exports = Loan;