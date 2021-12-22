const { diamondAddress } = require('../constants/web3');
const OpenOracleContract = require('../blockchain/abis/OracleOpen.json');
const { sendTransaction, getWeb3 } = require('./transaction');

const liquidationTrigger = (address, loanId) => {
    const web3 = getWeb3();
    let oracleOpenContract = new web3.eth.Contract(
        OpenOracleContract.abi,
        diamondAddress
    );
    return sendTransaction(diamondAddress, oracleOpenContract, "liquidationTrigger", address, loanId);
}

const seedFairPrice = (address, tokenPrice) => {
    const web3 = getWeb3();
    let oracleOpenContract = new web3.eth.Contract(
        OpenOracleContract.abi,
        diamondAddress
    );
    return sendTransaction(diamondAddress, oracleOpenContract, "seedFairPrice", address, tokenPrice);
}

module.exports = {
    liquidationTrigger,
    seedFairPrice
}