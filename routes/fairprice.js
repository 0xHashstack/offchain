const fetch = require("node-fetch");
const { calculateMean } = require("../utils/maths");

const fetchFairPrice = async (req, res) => {
    try {
        let response = await fetch("https://api.pancakeswap.info/api/v2/tokens")
        let data = await response.json();
        return res.status(200).send(data);
    } catch(err) {
        return res.status(500).send(err);
    }
}
//http://localhost:3000/tokenPrice?token=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
const fetchTokenPrice = async (req, res) => {
    try {
        let response = await fetch(`https://api.pancakeswap.info/api/v2/tokens/${req.query.token}`)
        let data = await response.json();
        return res.status(200).send(data);
    } catch(err) {
        return res.status(500).send(err);
    }
}

//http://localhost:3000/pairs?token1=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&token2=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56
const fetchPairs = async (req, res) => {
    try {
        let response = await fetch(`https://api.pancakeswap.info/api/v2/pairs`)
        let data = await response.json();
        data = data.data[`${req.query.token1}_${req.query.token2}`]
        return res.status(200).send(data);
    } catch(err) {
        return res.status(500).send(err);
    }
}

const fetchOrderBookDepth = async (req, res) => {
    try {
        let response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${req.query.symbol}&limit=${req.query.limit}`)
        let data = await response.json();
        let askMean = calculateMean(data["asks"]);
        let bidMean = calculateMean(data["bids"]);
        data = {
            askMeanPrice: askMean["priceMean"],
            askMeanQuantity: askMean["quantityMean"],
            bidsMeanPrice: bidMean["priceMean"],
            bidsMeanQuantity: bidMean["quantityMean"]
        }
        return res.status(200).send(data);
    } catch(err) {
        return res.status(500).send(err);
    }
}

module.exports = {
    fetchFairPrice,
    fetchTokenPrice,
    fetchPairs,
    fetchOrderBookDepth
}