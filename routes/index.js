const express = require('express');
const { isWhiteListedAccount } = require('../controllers/account-controller');
const { getDepositsByAccountAPI, createNewDepositAPI, deleteAllDepositsAPI, addToDepositAPI } = require('../controllers/deposit-controller');
const { getLiquidationsAPI } = require('../controllers/liquidation-controller');
const { getLoansByAccountAPI, deleteAllLoans } = require('../controllers/loan-controller');
const { addNewAccount, whiteListAddedAccount } = require('./account');
const {liquidateLoan}= require('../web3/liquidation')
const router = express.Router();
const { fetchFairPriceAPI, seedTokenPriceToDB, getTokenPrice, fetchPairs, fetchOrderBookDepth, seedTokenPriceToContract } = require("./fairprice");
const { triggerLiquidation } = require("./oracleopen");
const { createWallet } = require("./wallet");
const logger = require('../utils/logger');


router.get('/', (req, res) => {
    logger.info("Server sending a All OK")
    res.status(200).send('Welcome to hashstack finance!!');
});

router.get('/fairPrice', fetchFairPriceAPI);
router.post('/tokenPrice', seedTokenPriceToDB);
router.get('/seedTokenPrice', seedTokenPriceToContract);

router.get('/getTokenPrice', getTokenPrice)
router.get('/pairs', fetchPairs);

router.get('/createWallet', createWallet);
router.post('/addAccount', addNewAccount);
router.post('/whiteListAccount', whiteListAddedAccount);
router.get('/isWhiteListedAccount', isWhiteListedAccount);

router.post('/triggerLiquidation', triggerLiquidation);

router.get('/priceDepth', fetchOrderBookDepth)

router.get('/getLoansByAccount', getLoansByAccountAPI);
router.get('/getDepositsByAccount', getDepositsByAccountAPI);
router.get('/getLiquidations', getLiquidationsAPI)

router.post('/createDeposit', createNewDepositAPI)
router.post('/addToDeposit', addToDepositAPI);

router.get('/deleteAllDeposits', deleteAllDepositsAPI);
router.get('/deleteAllLoans', deleteAllLoans);
// router.get('/liqLoan', liquidateLoan);

module.exports = router;