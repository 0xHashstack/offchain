const { addAccount, whiteListAccount } = require("../controllers/account-controller")

const addNewAccount = async (req, res) => {
    await addAccount(req, res);
}

const whiteListAddedAccount = async (req, res) => {
    await whiteListAccount(req, res);
}

module.exports = {
    addNewAccount,
    whiteListAddedAccount
}