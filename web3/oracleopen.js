const { diamondAddress } = require('../constants/constants');
const OpenOracleContract = require('../blockchain/abis/OracleOpen.json');
const LoanExt =require('../blockchain/abis/LoanExt.json');
const { sendTransaction, getWeb3, getValue } = require('./transaction');

const liquidationTrigger = (address, loanId) => {
    const web3 = getWeb3();
    let LoanExtContract = new web3.eth.Contract(
        LoanExt,
        diamondAddress
    );
    return sendTransaction(diamondAddress, LoanExtContract, "liquidationTrigger", address, loanId);
}

const setFairPrice = (requestId, fairPrice, market, amount) => {
    const web3 = getWeb3();
    let oracleOpenContract = new web3.eth.Contract(
        OpenOracleContract,
        diamondAddress
    );
    return sendTransaction(diamondAddress, oracleOpenContract, "setFairPrice", requestId, fairPrice, market, amount);
}

const getFairPrice = (market) => {
    const web3 = getWeb3();
    let oracleOpenContract = new web3.eth.Contract(
        OpenOracleContract.abi,
        diamondAddress
    );
    return getValue(oracleOpenContract, "getFairPrice", market);
}

module.exports = {
    liquidationTrigger,
    setFairPrice,
    getFairPrice
}