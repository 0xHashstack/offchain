const { diamondAddress } = require('../constants/web3');
const Diamond = require('../blockchain/abis/LibDiamond.json')
const { getWeb3 } = require("./transaction");
const { addLoan, getLoanById, updateLoanAmount } = require('../controllers/loan-controller');
const { seedFairPrice } = require('./oracleopen');
const { calculateFairPrice } = require('../routes/fairprice');

const listenToEvents = (app) => {
    const web3 = getWeb3();
    let diamondContract = new web3.eth.Contract(
        Diamond,
        diamondAddress
    )
    NewLoanEvent(diamondContract);
    SwapLoanEvent(diamondContract);
    FairPriceCallEvent(diamondContract);
    return app
}

const NewLoanEvent = (loanContract) => {
    console.log("Listening to NewLoan event")
    loanContract.events.NewLoan({}, (error, event) => {
        if (!error) {
            console.log(event.returnValues)
            let loanDetails = event.returnValues;
            let cdr = Number(loanDetails.collateralAmount) / Number(loanDetails.loanAmount);
            if(cdr >= 1) {
                loanDetails["debtCategory"] = 1;
            } else if (cdr >= 0.5 && cdr < 1) {
                loanDetails["debtCategory"] = 2;
            } else if (cdr >= 0.333 && cdr < 0.5) {
                loanDetails["debtCategory"] = 3;
            }
            addLoan(loanDetails);
        } else {
            console.error(error);
        }
    })
}

// Check if adding is same or we need to do fair price calculation here itself
const SwapLoanEvent = (loanContract) => {
    console.log("Listening to SwapLoan event")
    loanContract.events.MarketSwapped({}, async (error, event) => {
        if (!error) {
            console.log(event.returnValues)
            let loanId = event.returnValues.id;
            try {
                let loan = await getLoanById(loanId);
                let fairPrice = await calculateFairPrice(event.returnValues.marketTo, loan.loanAmount, event.returnValues.marketFrom);
                await updateLoanAmount(loanId, fairPrice);
            } catch(error) {
                console.error(error);
            }
        } else {
            console.error(error);
        }
    })
}

const FairPriceCallEvent = (oracleOpenContract) => {
    console.log("Listening to FairPriceCall event")
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