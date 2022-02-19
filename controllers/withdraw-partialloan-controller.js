const WithdrawalPartialLoanDb = require('../models/Withdrawal');
const logger = require("../utils/logger");

exports.createWithdrawalPartialLoan = async (withdrawPartialLoanDetails) => {
    try {
        logger.log('info','addToDeposit with : %s', withdrawPartialLoanDetails)
        withdrawPartialLoanAdded = await WithdrawalPartialLoanDb.create(withdrawPartialLoanDetails);
        console.log(`withdrawed New deposit  ${withdrawDepositDetails.depositId} created`, withdrawPartialLoanAdded);
        return withdrawPartialLoanAdded;
    } catch (error) {
        console.error(error);
        logger.log('error','createwithdrawNewDeposit retuened Error : %s', error)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages)
        } else {
            throw error;
        }
    }
}
