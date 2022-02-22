const mongoose = require('mongoose');

const WithdrawPartialLoanSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true   
    },
    amount: {
        type: Number,
        required: true
    },
    market: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});


const WithdrawPartialLoan= mongoose.model('WithdrawPartialLoan', WithdrawPartialLoanSchema);
module.exports = WithdrawPartialLoan;