const LoanRepaid = require('../models/LoanRepaid');
const logger = require("../utils/logger");

exports.createLoanRepaid = async (loanRepaidDetails) => {
    try {
        logger.log('info','addToDeposit with : %s', loanRepaidDetails)
        loanRepaidAdded = await LoanRepaid.create(loanRepaidDetails);
        console.log(`loanRepaid created`, loanRepaidAdded);
        return loanRepaidAdded;
    } catch (error) {
        console.error(error);
        logger.log('error','createLoanRepaidretuened Error : %s', error)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages)
        } else {
            throw error;
        }
    }
}
