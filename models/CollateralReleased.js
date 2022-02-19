const mongoose = require('mongoose');

const CollateralReleasedSchema = new mongoose.Schema({
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
    timestamp: {
        type: Date,
        required: true
    }
});

const CollateralReleased = mongoose.model('CollateralReleased', CollateralReleasedSchema);
module.exports = CollateralReleased;