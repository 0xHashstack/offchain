const FairPrice = require("../models/FairPrice");

const addFairPrice = async (req, res, fairPriceData) => {
    try {
        fairPriceData["timestamp"] = new Date().getTime();
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
        const fairPrice = await getFairPriceFromDB(req.query.market);
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

const getFairPriceFromDB = (market) => {
    return FairPrice.find({market});
}

const getLastRequest = async (market) => {
    try {
        let data = await FairPrice.find({market: market});
        if(!data) {
            return 0;
        }
        let lastData = data[data.length - 1];
        return lastData["requestId"];
    } catch(err) {
        throw err;
    }
}

const getLastRequestAPI = async (req, res, next) => {
    try {
        let data = await getLastRequest(req.query.market);
        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).send(err);
    }
}

module.exports = {
    addFairPrice,
    getFairPriceBySymbol,
    getFairPriceFromDB,
    getLastRequest,
    getLastRequestAPI
}