const { symbols, commitmentHash } = require('../constants/web3');
const Deposit = require('../models/Deposit');

exports.addDeposit = async (depositDetails) => {
    try {
        depositDetails["timestamp"] = new Date().getTime();
        const depositAdded = await Deposit.create(depositDetails);
        return depositAdded;
    } catch (error) {
        console.log(req);
        if(error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages)
        } else {
            throw error;
        }
    }
}

exports.getDepositsByAccountAPI = async (req, res, next) => {
    try {
        let deposits = await Deposit.find({account: req.params.account});
        deposits["market"] = symbols[deposits["market"]];
        deposits["commitment"] = commitmentHash[deposits["commitment"]];
        return res.status(200).json({
            success: true,
            data: deposits
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Error Getting deposits: ${error.message}`
        })
    }
}