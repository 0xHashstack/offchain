const Web3 = require('web3');
const { rpcURLs, chain } = require("../constants/web3");

const getWeb3 = () => {
    return new Web3(rpcURLs["infuraRopsten"]);
}

const estimateGas = (contractObject, method, options, params) => {
    return contractObject.methods[method](...params).estimateGas(options);
}

const sendTransaction = async (diamondAddress, contract, method, ...params) => {
    const address = process.env.ADDRESS;
    const privateKey = process.env.PRIVATEKEY;

    if (!address || !privateKey) {
        throw new Error("Address/Private key not availabe in environment");
    }

    const web3 = getWeb3();
    web3.eth.accounts.wallet.add(privateKey);
    let tx = contract.methods[method](...params);

    try {
        let gas = await estimateGas(contract, method, {from: address}, params);
        let gasPrice = await web3.eth.getGasPrice();
        let nonce = await web3.eth.getTransactionCount(address);
        let data = tx.encodeABI();
        let txData = {
            from: address,
            to: diamondAddress,
            data: data,
            gas,
            gasPrice,
            nonce,
            chain: chain,
        };
        const receipt = await web3.eth.sendTransaction(txData);
        return receipt.transactionHash
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = {
    sendTransaction,
    getWeb3
}