const FairPrice = require("../models/FairPrice");

const addFairPrice = async (req, res, fairPriceData) => {
    try {
        const fairPrice = await FairPrice.create(fairPriceData);
        return res.status(201).json({
            success: true,
            data: fairPrice
        })
    } catch (error) {
        console.log(req)
        if(error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            
            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: `Error Adding Fair Price: ${error.message}`
            })
        }
    }
}

const getFairPriceBySymbol = async (req, res, next) => {
    try {
        const fairPrice = await getFairPriceFromDB(req.query.symbol);
        return res.status(200).json({
            success: true,
            data: fairPrice
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Error Getting Fair Price: ${error.message}`
        })
    }
}

const getFairPriceFromDB = (symbol) => {
    return FairPrice.find({symbol});
}

module.exports = {
    addFairPrice,
    getFairPriceBySymbol,
    getFairPriceFromDB
}