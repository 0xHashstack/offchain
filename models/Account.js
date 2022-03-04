const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: [true,'Address need to be unique']
    },
    timestamp: {
        type: Date,
        required: true
    },
    whiteListed: {
        type: Boolean,
        required: true
    },
    whitelist_Requested:{
        type: Boolean,
        required: true
    },
    waitlist_ct:{
        type: Number,
        required: false
    }

});


const Accounts = mongoose.model('Accounts', AccountSchema);

module.exports = Accounts;
