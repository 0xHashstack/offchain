const Accounts = require("../models/Account");

exports.addAccountAPI = async (req, res, next) => {
    try {
        const { address, whiteListed } = req.body;
        let accountDetails = {
            address,
            whiteListed,
            timestamp: new Date().getTime()
        }
        const account = await Accounts.create(accountDetails);
        return res.status(201).json({
            success: true,
            data: account
        })
    } catch (error) {
        console.log(req);

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
        let account = await Accounts.findOne({address: address});
        if(account) {
            return res.status(201).json({
                success: true,
                isWhiteListed: account.whiteListed
            })
        }
        return res.status(202).json({
            success: true,
            isWhiteListed: false,
            message: "Account not found" 
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            error: `Error Getting Account ${req.body.address}: ${error.message}`
        })
    }
}