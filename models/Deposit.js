const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    market: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    commitment: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});


const Deposit = mongoose.model('Deposit', DepositSchema);

module.exports = Deposit;