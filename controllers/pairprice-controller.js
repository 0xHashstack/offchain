const PairPrice = require('../models/PairPrice');

const addPairPrice = async(req, res, pairPriceData) => {
    try {
        const pairPrice = await PairPrice.create(pairPriceData);
        return res.status(201).json({
            success: true,
            data: pairPrice
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

module.exports = {
    addPairPrice
}