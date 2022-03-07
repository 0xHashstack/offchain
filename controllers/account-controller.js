const Accounts = require("../models/Account");
const WL_Address= require("../models/WL_Address");

const logger = require("../utils/logger");
const { CT_WHITELISTING } = require('../constants/constants');

exports.addAccountAPI = async (req, res, next) => {
    try {
        var { address, whiteListed } = req.body;
        
        const timestamp =  new Date().getTime()
        let mwaitlist_ct = await Accounts.find({whiteListed:false, "timestamp" : {
            $lte : timestamp
        }}).count();
        
        let accountDetails = {
            address:address,
            whiteListed:false,
            timestamp: timestamp,
            waitlist_ct: mwaitlist_ct,
            whitelist_Requested: true
        }
        const account = await Accounts.create(accountDetails);
        return res.status(201).json({
            success: true,
            data: account
        })
    } catch (error) {
        console.log(error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: `Error Adding Account: ${error.message}`
            })
        }
    }
}

exports.addAccount = async (accountDetails) => {
    try {
        const account = await Accounts.create(accountDetails);
        return account;
    } catch(error) {
        throw error;
    }
}

exports.whiteListAccount = async (req, res, next) => {
    try {
        const { address } = req.body;
        let account = await Accounts.findOneAndUpdate({ address: address }, { whiteListed: true }, {
            new: true
        });
        return res.status(201).json({
            success: true,
            data: account
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Error Getting Account ${req.body.address}: ${error.message}`
        })
    }
}
exports.isWhiteListedAccount = async(req, res, next) => {
    try {
        const address = req.query.address;
        let account = await Accounts.findOne({address: { $regex : new RegExp(address, "i") } });
        if(account) {
            let mwaitlist_ct = await Accounts.find({whiteListed:false, "timestamp" : {
                $lte : account.timestamp
            }}).count();
            
            let wl_account=await WL_Address.findOne({address: { $regex : new RegExp(address, "i") } })
            console.log(wl_account);
            var mflag=(new Date().getTime()-new Date(account.timestamp).getTime()>CT_WHITELISTING) || account.whiteListed
            //Updating the Value of isWhitelisted in the Database
            let updated_account = await Accounts.findOneAndUpdate({ address: address }, { whiteListed: mflag }, { new:true });

            logger.log('info','isWhitelistedAccount returns the Status from DB %s : %s', mflag, address)
            const whitelist_Requested = account.whitelist_Requested

            //Hardcoding the mflag below for testing. Should be removed.
            mflag=false;
            if(wl_account){
               mflag=true;
            }
            return res.status(201).json({
                success: true,
                isWhiteListed: mflag,
                waitlist_ct: mwaitlist_ct,
                whitelist_Requested
            })
        }
        logger.log('info','isWhitelistedAccount returns False Not Found in DB: %s', address)
        return res.status(202).json({
            success: true,
            isWhiteListed: false,
            message: "Account not found" ,
            waitlist_ct: -1
        })
    } catch(error) {
        logger.error('isWhitelistedAccount returns Error : %s', new Error(error))
        return res.status(500).json({
            success: false,
            error: `Error Getting Account ${req.body.address}: ${error.message}`
        })
    }
}
