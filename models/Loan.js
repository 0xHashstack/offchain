const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    market: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    loanCommitment: {
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
    }
});


const Loan = mongoose.model('Loan', LoanSchema);

module.exports = Loan;