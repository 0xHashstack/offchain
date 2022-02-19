const mongoose = require('mongoose');

const LoanRepaidSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true,
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

const LoanRepaid = mongoose.model('LoanRepaid', LoanRepaidSchema);
module.exports = LoanRepaid;