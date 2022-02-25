const mongoose = require('mongoose');

const WL_Address_Schema = new mongoose.Schema({
   
    address: {
        type: String,
        required: [true, 'Address field missing'],
        unique: [true,'Address Already Whitelisted']
    },
});

const WL_Address = mongoose.model('WL_Address', WL_Address_Schema,'wl_address');
module.exports = WL_Address;
