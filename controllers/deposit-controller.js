const { default: BigNumber } = require('bignumber.js');
const { symbols, commitmentHash } = require('../constants/constants');
const Deposit = require('../models/Deposit');
const { calculateAcquiredYield } = require('../utils/maths');

exports.createNewDepositAPI = async (req, res, next) => {
    try {
        const depositDetails = req.body;
        const depositAdded = await this.createNewDeposit(depositDetails);
        return res.status(200).json({
            success: true,
            data: depositAdded
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Error Adding deposit: ${error.message}`
        })
    }
}

exports.createNewDeposit = async (depositDetails) => {
    try {
        depositDetails["timestamp"] = new Date().getTime();
        if (depositDetails["commmitment"]) {
            depositDetails["commitment"] = depositDetails["commmitment"];
        }
        const depositAdded = await Deposit.create(depositDetails);
        return depositAdded;
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages)
        } else {
            throw error;
        }
    }
}

exports.addToDeposit = async (updatedDepositDetails) => {
    try {
        let deposit = await Deposit.findOne({_id: updatedDepositDetails._id});
        const now = new Date().getTime();
        let acquiredYield = deposit["acquiredYield"] || 0;
        deposit["acquiredYield"] = acquiredYield + calculateAcquiredYield(deposit, now);
        deposit["lastModified"] = now;
        deposit["amount"] = updatedDepositDetails["amount"];
        let depositAdded = await Deposit.updateOne({_id: deposit._id}, deposit);
        return depositAdded;
    } catch (error) {
        throw error;
    }
}

exports.updateAcquiredYield = async (deposit) => {
    try {
        await Deposit.findOneAndUpdate({ _id: deposit._id }, { acquiredYield: deposit.acquiredYield, lastModified: deposit.lastModified })
    } catch (error) {
        throw error;
    }
}

exports.getDepositsByAccountAPI = async (req, res, next) => {
    try {
        let deposits = await Deposit.find({ account: req.query.account });
        deposits.forEach(async (deposit) => {
            const now = new Date().getTime();
            let acquiredYield = deposit["acquiredYield"] || 0;
            deposit["market"] = symbols[deposit["market"]];
            deposit["commitment"] = commitmentHash[deposit["commitment"]];
            deposit["acquiredYield"] = acquiredYield + calculateAcquiredYield(deposit, now);
            deposit["lastModified"] = now;
            await this.updateAcquiredYield(deposit);
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