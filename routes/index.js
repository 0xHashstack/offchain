const express = require('express');
const router = express.Router();
const { fetchFairPrice, fetchTokenPrice, fetchPairs } = require("./fairprice");
const { triggerLiquidation } = require("./oracleopen");
const { createWallet } = require("./wallet");

router.get('/', (req, res) => {
    res.status(200).send('Welcome to hashstack finance!');
});

router.get('/fairPrice', fetchFairPrice);
router.get('/tokenPrice', fetchTokenPrice);
router.get('/pairs', fetchPairs);

router.get('/createWallet', createWallet);

router.post('/triggerLiquidation', triggerLiquidation);

module.exports = router;