const mongoose = require('mongoose');

const AddCollateralSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    account: {
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


const AddCollateral = mongoose.model('AddCollateral', AddCollateralSchema);
module.exports = AddCollateral;