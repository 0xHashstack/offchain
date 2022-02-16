const { diamondAddress } = require('../constants/constants');
const Diamond = require('../blockchain/abis/LibDiamond.json');
const Deposit = require('../blockchain/abis/Deposit.json');
const LoanExt = require('../blockchain/abis/LoanExt.json');
const LibOpen = require('../blockchain/abis/LibOpen.json');
const { getWeb3 } = require("./transaction");
const { addLoan, getLoanById, updateLoanAmount } = require('../controllers/loan-controller');
const { calculateFairPrice } = require('../routes/fairprice');
const { createNewDeposit, addToDeposit } = require('../controllers/deposit-controller');
const { default: BigNumber } = require('bignumber.js');
const logger = require("../utils/logger");

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
    let libOpenContract = new  web3.eth.Contract(
        LibOpen,
        diamondAddress
    )
    NewLoanEvent(loanContract);
    SwapLoanEvent(libOpenContract);
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
                logger.log('info','NewDepositEvent Called with : %s', event)
                logger.log('info','NewDepositEvent_str Called with : %s', JSON.stringify(event))
                await createNewDeposit(event.returnValues)
            } else {
                console.error(error);
            }
        }
        catch (err) {
            logger.log('error','NewDepositEvent retuened Error : %s', JSON.stringify(err))
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
                logger.log('info','AddToDepositEvent Called with : %s', event)
                logger.log('info','AddToDepositEvent_str Called with : %s', JSON.stringify(event))
                await addToDeposit(event.returnValues)
            } else {
                console.error(error);
                logger.log('error','AddToDepositEvent retuened Error : %s', err)
            }
        }
        catch (err) {
            console.error(err);
            logger.log('error','AddToDepositEvent retuened Error : %s', JSON.stringify(err))
        }
    })
}

const NewLoanEvent = (loanContract) => {
    console.log("Listening to NewLoan event")
    loanContract.events.NewLoan({}, async (error, event) => {
        try {
            logger.log('info','NewLoanEvent Called with : %s', JSON.stringify(event))
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
            logger.log('error','NewLoanEvent retuened Error : %s', JSON.stringify(err))
        }
    })
}

// Check if adding is same or we need to do fair price calculation here itself
const SwapLoanEvent = (libOpenContract) => {
    console.log("Listening to SwapLoan event")
    libOpenContract.events.MarketSwapped({}, async (error, event) => {
        logger.log('info','SwapLoanEvent Called with : %s', JSON.stringify(event))
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
            logger.log('error','SwapLoanEvent retuened Error : %s', JSON.stringify(err))
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