const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
    depositId: {
        type: Number,
        required: true
    },
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
    acquiredYield: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        required: true
    },
    lastModified: {
        type: Date,
        required: true
    }
});


const Deposit = mongoose.model('Deposit', DepositSchema);

module.exports = Deposit;