const { symbols, commitmentHash } = require('../constants/web3');
const Deposit = require('../models/Deposit');

exports.addDepositAPI = async (req, res, next) => {
    try {
        const depositDetails = req.body;
        const depositAdded = await this.addDeposit(depositDetails);
        return res.status(200).json({
            success: true,
            data: depositAdded
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            error: `Error Adding deposit: ${error.message}`
        })
    }
}

exports.addDeposit = async (depositDetails) => {
    try {
        depositDetails["timestamp"] = new Date().getTime();
        if (depositDetails["commmitment"]) {
            depositDetails["commitment"] = depositDetails["commmitment"];
        }
        const depositAdded = await Deposit.create(depositDetails);
        return depositAdded;
    } catch (error) {
        console.error(error);
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
        let deposits = await Deposit.find({account: req.query.account});
        deposits.forEach(deposit => {
            deposit["market"] = symbols[deposit["market"]];
            deposit["commitment"] = commitmentHash[deposit["commitment"]];
        });
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