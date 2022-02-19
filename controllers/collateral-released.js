const CollateralReleased = require('../models/CollateralReleased');
const logger = require("../utils/logger");

exports.createCollateralReleased = async (collateralReleasedDetails) => {
    try {
        logger.log('info','addToDeposit with : %s', collateralReleasedDetails)
        collateralReleasedAdded = await CollateralReleased.create(collateralReleasedDetails);
        return collateralReleased;
    } catch (error) {
        console.error(error);
        logger.log('error','collateralReleasedDetails retuened Error : %s', error)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            throw new Error(messages)
        } else {
            throw error;
        }
    }
}
