const mongoose = require('mongoose');

const LiquidationSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    // loanId: {
    //     type: String,
    //     required: true
    // },
    loanMarket: {
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


const Liquidation = mongoose.model('Liquidation', LiquidationSchema);

module.exports = Liquidation;