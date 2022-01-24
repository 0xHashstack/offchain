const mongoose = require('mongoose');

const FairPriceSchema = new mongoose.Schema({
    requestId: {
        type: Number,
        required: true,
    },
    market: {
        type: String,
        required: true
    },
    fairPrice: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionHash: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});


const FairPrice = mongoose.model('FairPrice', FairPriceSchema);

module.exports = FairPrice;