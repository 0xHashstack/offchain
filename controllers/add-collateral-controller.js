const AddCollateral = require('../models/AddCollateral');
const logger = require("../utils/logger");

exports.createAddCollateralDeposit = async (createAddCollateralDepositDetails) => {
    try {
        logger.log('info','createAddCollateralDepositDetails with : %s', createAddCollateralDepositDetails)
        collateralDepositAdded = await AddCollateral.create(createAddCollateralDepositDetails);
        return collateralDepositAdded;
    } catch (error) {
        console.error(error);
        logger.log('error','createAddCollateralDeposit retuened Error : %s', error)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages)
        } else {
            throw error;
        }
    }
}
