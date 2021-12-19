const wallet = require("ethereumjs-wallet")

const generateWallet = () => {
    return wallet.default.generate();
}

module.exports = {
    generateWallet
}