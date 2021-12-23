const fetch = require("node-fetch");
const { addFairPrice, getFairPriceBySymbol, getFairPriceFromDB } = require("../controllers/fairprice-controller");
const { calculateMean } = require("../utils/maths");
const { seedFairPrice } = require('../web3/oracleopen');

const fetchFairPrice = async (req, res) => {
    try {
        const data = await fetchPairs(req, res);
        let amount = req.query.amount;
        let delta = data["quote_volume"] - Number(amount);
        let tradePrice = data["k_value"]/(delta*data["y"]);
        
        // Add pancake swap txn price (0.25%)
        let fairPrice = tradePrice + (tradePrice * 0.25/100);

        return res.status(200).send({
            "tradePrice": tradePrice,
            "fairPrice": fairPrice
        })
    } catch(err) {
        return res.status(500).send(err);
    }
}
//http://localhost:3000/tokenPrice?token=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
const seedTokenPriceToDB = async (req, res) => {
    try {
        let response = await fetch(`https://api.pancakeswap.info/api/v2/tokens/${req.query.token}`)
        let data = await response.json();
        await addFairPrice(req, res, {
            name: data["data"].name,
            symbol: data["data"].symbol,
            price: data["data"].price,
            price_BNB: data["data"].price_BNB,
            address: req.query.token,
            timestamp: new Date().getTime()
        })
    } catch(err) {
        console.log(err)
        return res.status(500).send(err.message);
    }
}

const getTokenPrice = async (req, res) => {
    await getFairPriceBySymbol(req, res)
}

const seedTokenPriceToContract = async (req, res) => {
    try {
        let tokenPrice = await getFairPriceFromDB(req.query.symbol);
        let latestPrice = tokenPrice[tokenPrice.length - 1];
        seedFairPrice(latestPrice["address"], latestPrice["price"]);
    } catch(err) {
        console.log(err)
        return res.status(500).send(err.message);
    }
}

//http://localhost:3000/pairs?token1=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&token2=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56
const fetchPairs = async (req, res) => {
    try {
        let response = await fetch(`https://api.pancakeswap.info/api/v2/pairs`)
        let data = await response.json();
        data = data.data[`${req.query.token1}_${req.query.token2}`];

        // For calculation refer: https://research.paradigm.xyz/amm-price-impact
        let x = (Number(data["price"]) * Number(data["quote_volume"]));
        let y = (Number(data["base_volume"]) * 1)
        data["k_value"] = x * y; // 1 because of USDT
        data["x"] = x;
        data["y"] = y;

        return data;
    } catch(err) {
        return res.status(500).send(err);
    }
}

//http://localhost:3000/priceDepth?symbol=ETHBUSD&limit=5
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
    seedTokenPriceToDB,
    fetchPairs,
    fetchOrderBookDepth,
    getTokenPrice,
    seedTokenPriceToContract
}