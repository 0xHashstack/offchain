const { diamondAddress } = require('../constants/constants');
const Diamond = require('../blockchain/abis/LibDiamond.json');
const Deposit = require('../blockchain/abis/Deposit.json');
const LoanExt = require('../blockchain/abis/LoanExt.json');
const { getWeb3 } = require("./transaction");
const { addLoan, getLoanById, updateLoanAmount } = require('../controllers/loan-controller');
const { calculateFairPrice } = require('../routes/fairprice');
const { createNewDeposit, addToDeposit } = require('../controllers/deposit-controller');
const { default: BigNumber } = require('bignumber.js');

const listenToEvents = (app) => {
    const web3 = getWeb3();
    let diamondContract = new web3.eth.Contract(
        Diamond,
        diamondAddress
    )
    let loanContract = new web3.eth.Contract(
        LoanExt,
        diamondAddress
    )
    let depositContract = new web3.eth.Contract(
        Deposit,
        diamondAddress
    )
    NewLoanEvent(loanContract);
    SwapLoanEvent(diamondContract);
    // FairPriceCallEvent(loanContract);
    NewDepositEvent(depositContract);
    AddToDepositEvent(depositContract);
    return app
}

const NewDepositEvent = (depositContract) => {
    console.log("Listening to NewDeposit event");
    depositContract.events.NewDeposit({}, async (error, event) => {
        try {
            if (!error) {
                console.log(event);
                console.log(event.returnValues)
                await createNewDeposit(event.returnValues)
            } else {
                console.error(error);
            }
        }
        catch (err) {
            console.error(err);
        }
    })
}

const AddToDepositEvent = (depositContract) => {
    console.log("Listening to DepositAdded event");
    depositContract.events.DepositAdded({}, async (error, event) => {
        try {
            if (!error) {
                console.log(event);
                console.log(event.returnValues)
                await addToDeposit(event.returnValues)
            } else {
                console.error(error);
            }
        }
        catch (err) {
            console.error(err);
        }
    })
}

const NewLoanEvent = (loanContract) => {
    console.log("Listening to NewLoan event")
    loanContract.events.NewLoan({}, async (error, event) => {
        try {
            if (!error) {
                console.log(event.returnValues)
                let loanDetails = event.returnValues;
                let cdr = BigNumber(loanDetails.collateralAmount) / BigNumber(loanDetails.loanAmount);
                if (cdr >= 1) {
                    loanDetails["debtCategory"] = 1;
                } else if (cdr >= 0.5 && cdr < 1) {
                    loanDetails["debtCategory"] = 2;
                } else if (cdr >= 0.333 && cdr < 0.5) {
                    loanDetails["debtCategory"] = 3;
                }
                loanDetails["cdr"] = cdr;
                // loanDetails["loanCommitment"] = loanDetails["commitment";
                await addLoan(loanDetails);
            } else {
                console.error(error);
            }
        }
        catch (err) {
            console.error(err);
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
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error(error);
        }
    })
}

// const FairPriceCallEvent = (oracleOpenContract) => {
//     console.log("Listening to FairPriceCall event")
//     oracleOpenContract.events.FairPriceCall({}, async (error, event) => {
//         try {
//             if (!error) {
//                 console.log(event.returnValues)
//                 let lastRequest = event.returnValues;
//                 const fairPrice = await calculateFairPrice(lastRequest.market, lastRequest.amount);
//                 let tx = await setFairPrice(lastRequest.requestId, fairPrice, lastRequest.market, lastRequest.amount);
//                 console.log("Fair Price seeded: ", tx);
//             } else {
//                 console.error(error);
//             }
//         }
//         catch (error) {
//             console.error(error);
//         }
//     })
// }

module.exports = {
    listenToEvents
}