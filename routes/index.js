const express = require('express');
const router = express.Router();
const { fetchFairPrice, seedTokenPriceToDB, getTokenPrice, fetchPairs, fetchOrderBookDepth, seedTokenPriceToContract } = require("./fairprice");
const { triggerLiquidation } = require("./oracleopen");
const { createWallet } = require("./wallet");

router.get('/', (req, res) => {
    res.status(200).send('Welcome to hashstack finance!');
});

router.get('/fairPrice', fetchFairPrice);
router.get('/tokenPrice', seedTokenPriceToDB);
router.get('/seedTokenPrice', seedTokenPriceToContract);

router.get('/getTokenPrice', getTokenPrice)
router.get('/pairs', fetchPairs);

router.get('/createWallet', createWallet);

router.post('/triggerLiquidation', triggerLiquidation);

router.get('/priceDepth', fetchOrderBookDepth)

module.exports = router;