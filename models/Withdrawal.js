const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
    address: {
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
    commitment: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});


const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);
module.exports = Withdrawal;