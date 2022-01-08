const Liquidation = require('../models/Liquidation');

exports.addLiquidation = async (liquidationDetails) => {
    try {
        liquidationDetails["timestamp"] = new Date().getTime();
        const liquidationAdded = await Liquidation.create(liquidationDetails);
        return liquidationAdded;
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

exports.getLiquidationsAPI = async (req, res, next) => {
    try {
        const liquidations = await Liquidation.find();

        return res.status(200).json({
            success: true,
            data: liquidations
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Error Getting liquidations: ${error.message}`
        })
    }
}