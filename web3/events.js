const { diamondAddress } = require('../constants/web3');
const Loan = require('../blockchain/abis/Loan1.json');
const { getWeb3 } = require("./transaction")

const listenToEvents = (app) => {
    const web3 = getWeb3();
    let loanContract = new web3.eth.Contract(
        Loan,
        diamondAddress
    );
    loanContract.events.NewLoan({}, (error, event) => {
        console.log(event.returnValues)
    })
    return app
}

module.exports = {
    listenToEvents
}