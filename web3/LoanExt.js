const { diamondAddress } = require('../constants/constants');
const LoanExt =require('../blockchain/abis/LoanExt.json');
const { sendTransaction, getWeb3, getValue } = require('./transaction');

const liquidationTrigger = (address, market, commitment) => {
    const web3 = getWeb3();
    let LoanExtContract = new web3.eth.Contract(
        LoanExt,
        diamondAddress
    );
    return sendTransaction(diamondAddress, LoanExtContract, "liquidation", address, market,commitment);
}

module.exports = {
    liquidationTrigger
}