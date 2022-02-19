const WithdrawalDeposit = require('../models/Withdrawal');
const logger = require("../utils/logger");

exports.createWithdrawalDeposit = async (withdrawDepositDetails) => {
    try {
        logger.log('info','addToDeposit with : %s', withdrawDepositDetails)
        withdrawDepositDetails["address"] = withdrawDepositDetails?.account
        withdrawDepositAdded = await WithdrawalDeposit.create(withdrawDepositDetails);
        console.log(`withdrawed New deposit  ${withdrawDepositDetails.depositId} created`, withdrawDepositAdded);
        return withdrawDepositAdded;
    } catch (error) {
        console.error(error);
        logger.log('error','createwithdrawalDeposit retuened Error : %s', error)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages)
        } else {
            throw error;
        }
    }
}
