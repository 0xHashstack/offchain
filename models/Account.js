const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    whiteListed: {
        type: Boolean,
        required: true
    }
});


const Accounts = mongoose.model('Accounts', AccountSchema);

module.exports = Accounts;