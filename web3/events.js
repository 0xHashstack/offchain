const { diamondAddress } = require('../constants/web3');
const Loan = require('../blockchain/abis/Loan1.json');
const OracleOpen = require('../blockchain/abis/OracleOpen.json');
const { getWeb3 } = require("./transaction");
const { addLoan } = require('../controllers/loan-controller');
const { seedFairPrice } = require('./oracleopen');
const { calculateFairPrice } = require('../routes/fairprice');

const listenToEvents = (app) => {
    const web3 = getWeb3();
    let loanContract = new web3.eth.Contract(
        Loan,
        diamondAddress
    );
    let oracleOpenContract = new web3.eth.Contract(
        OracleOpen.abi,
        diamondAddress
    )
    NewLoanEvent(loanContract);
    FairPriceCallEvent(oracleOpenContract);
    return app
}

const NewLoanEvent = (loanContract) => {
    console.log("Listening to NewLoan event")
    loanContract.events.NewLoan({}, (error, event) => {
        if (!error) {
            console.log(event.returnValues)
            addLoan(event.returnValues);
        } else {
            console.error(error);
        }
    })
}

const FairPriceCallEvent = (oracleOpenContract) => {
    oracleOpenContract.events.FairPriceCall({}, async (error, event) => {
        if (!error) {
            console.log(event.returnValues)
            let lastRequest = event.returnValues;
            const fairPrice = await calculateFairPrice(lastRequest.market, lastRequest.amount);
            let tx = await seedFairPrice(lastRequest.requestId, fairPrice, lastRequest.market, lastRequest.amount);
            console.log("Fair Price seeded: ", tx);
        } else {
            console.error(error);
        }
    })
}

module.exports = {
    listenToEvents
}