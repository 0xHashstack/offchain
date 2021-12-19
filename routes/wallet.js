const {generateWallet} = require('../web3/wallet');

const createWallet = async (req, res) => {
    let wallet = generateWallet();
    let walletJson = {
        address: wallet.getAddressString(),
        privateKey: wallet.getPrivateKeyString(),
        publicKey: wallet.getPublicKeyString()
    }
    res.status(200).send(walletJson)
}

module.exports = {
    createWallet
}