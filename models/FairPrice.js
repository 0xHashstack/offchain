const mongoose = require('mongoose');

const FairPriceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    price_BNB: {
        type: Number,
        required: true
    },
    address: {
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