const mongoose = require('mongoose');

const PairPriceSchema = new mongoose.Schema({
    pair_address: {
        type: String,
        required: true
    },
    base_name: {
        type: String,
        required: true
    },
    base_symbol: {
        type: String,
        required: true
    },
    base_address: {
        type: String,
        required: true
    }, 
    quote_name: {
        type: String,
        required: true
    }, 
    quote_symbol: {
        type: String,
        required: true
    },
    quote_address: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    base_volume: {
        type: Number,
        required: true
    },
    quote_volume: {
        type: Number,
        required: true
    },
    liquidity_BNB: {
        type: Number,
        required: true
    },
    liquidity: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});


const PairPrice = mongoose.model('PairPrice', PairPriceSchema);

module.exports = PairPrice;