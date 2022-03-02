const { diamondAddress } = require('../constants/constants');
const Diamond = require('../blockchain/abis/LibDiamond.json');
const Deposit = require('../blockchain/abis/Deposit.json');
const Loan = require('../blockchain/abis/Loan.json');
const LoanExt = require('../blockchain/abis/LoanExt.json');
const LibOpen = require('../blockchain/abis/LibOpen.json');
const { getWeb3 } = require("./transaction");
const { addLoan, getLoanById, updateSwapLoadEventData, getLoanData } = require('../controllers/loan-controller');
const { calculateFairPrice } = require('../routes/fairprice');
const { createNewDeposit, addToDeposit } = require('../controllers/deposit-controller');
const { createWithdrawalDeposit } = require('../controllers/withdrawal-controller');
const { createWithdrawalPartialLoan } = require ('../controllers/withdraw-partialloan-controller');
const { createAddCollateralDeposit } = require('../controllers/add-collateral-controller');
const { addLiquidation } = require('../controllers/liquidation-controller');
const { createLoanRepaid } = require('../controllers/loan-repaid-controller');
const { createCollateralReleased } = require ('../controllers/collateral-released');
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
    let partialLoanContract = new web3.eth.Contract(
        Loan,
        diamondAddress
    )
    NewLoanEvent(loanContract);
    SwapLoanEvent(libOpenContract);
    // FairPriceCallEvent(loanContract);
    NewDepositEvent(depositContract);
    AddToDepositEvent(depositContract);
    WithdrawalDepositEvent(depositContract);
    //partialLoanContract is loan contract
    WithdraPartialLoanDepositEvent(partialLoanContract);
    //loan contract is loanExt contract
    RepaidLoanEvent(loanContract);
    LiquidationEvent(loanContract);
    AddCollateralEvent(partialLoanContract);
    collatralReleasedEvent(partialLoanContract);
    return app
}

const NewDepositEvent = (depositContract) => {
    //console.log("Listening to NewDeposit event");
    depositContract.events.NewDeposit({}, async (error, event) => {
        try {
            if (!error) {
                console.log("****** NewDepositEvent ********")
                console.log(event.returnValues)
                logger.log('info','NewDepositEvent Called with : %s', JSON.stringify(event))
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
    //console.log("Listening to DepositAdded event");
    depositContract.events.DepositAdded({}, async (error, event) => {
        try {
            if (!error) {
                console.log("****** AddToDepositEvent ********")
                console.log(event.returnValues)
                logger.log('info','AddToDepositEvent Called with : %s', JSON.stringify(event))
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
    //console.log("Listening to NewLoan event")
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
    //console.log("Listening to SwapLoan event")
    libOpenContract.events.MarketSwapped({}, async (error, event) => {
        logger.log('info','SwapLoanEvent Called with : %s', JSON.stringify(event))

        if (!error) {
            // let loanId = event.returnValues.id;
            const { account, loanMarket, commmitment, currentMarket, currentAmount, isSwapped } = event.returnValues;
            try {
                // let loan = await getLoanById(loanId);
                let loan = await getLoanData(account, loanMarket, commmitment);
                // let fairPrice = await calculateFairPrice(event.returnValues.marketTo, loan.loanAmount, event.returnValues.marketFrom);
                // await updateLoanAmount(loan.loanId, fairPrice);
                await updateSwapLoadEventData(loan.loanId, account, currentMarket, currentAmount, isSwapped);
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

//emit Withdrawal(msg.sender,_market, _amount, _commitment, block.timestamp);
const WithdrawalDepositEvent = (depositContract) => {
    //console.log("Listening to withdrawal event", depositContract); //
    depositContract.events.DepositWithdrawal({}, async (error, event) => {
        try {
            if (!error) {
                console.log("****** withdrawal ********")
                console.log(event.returnValues)
                logger.log('info','NewDepositEvent_str Called with : %s', JSON.stringify(event))
                await createWithdrawalDeposit(event.returnValues) //
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

const WithdraPartialLoanDepositEvent = (loanContract) => {
    //console.log("Listening to WithdraPartialLoanDepositEvent event", loanContract); //
    loanContract.events.WithdrawPartialLoan({}, async (error, event) => {
        try {
            if (!error) {
                console.log("****** WithdrawPartialLoan ********")
                console.log(event.returnValues)
                logger.log('info','WithdrawPartialLoan Called with : %s', JSON.stringify(event))
                await createWithdrawalPartialLoan(event.returnValues)
            } else {
                console.error(error);
            }
        }
        catch (err) {
            logger.log('error','WithdraPartialLoanDepositEvent retuened Error : %s', JSON.stringify(err))
            console.error(err);
        }
    })
}

const RepaidLoanEvent = (loanExtContract) => {
    //console.log("Listening to RepaidLoanEvent event", loanExtContract); //
    loanExtContract.events.LoanRepaid({}, async (error, event) => {
        try {
            if (!error) {
                console.log("****** RepaidLoanEvent ********")
                console.log(event.returnValues)
                logger.log('info','RepaidLoanEvent Called with : %s', JSON.stringify(event))
                await createLoanRepaid(event.returnValues) //
            } else {
                console.error(error);
            }
        }
        catch (err) {
            logger.log('error','RepaidLoanEvent retuened Error : %s', JSON.stringify(err))
            console.error(err);
        }
    })
}

const LiquidationEvent = (loanExtContract) => {
    //console.log("Listening to LiquidationEvent event", loanExtContract); //
    loanExtContract.events.Liquidation({}, async (error, event) => {
        try {
            if (!error) {
                console.log("****** LiquidationEvent ********")
                console.log(event.returnValues)
                logger.log('info','LiquidationEvent Called with : %s', JSON.stringify(event))
                await addLiquidation(event.returnValues) //
            } else {
                console.error(error);
            }
        }
        catch (err) {
            logger.log('error','LiquidationEvent retuened Error : %s', JSON.stringify(err))
            console.error(err);
        }
    })
}

const AddCollateralEvent = (partialLoanContract) => {
    //console.log("Listening to AddCollateralEvent event", partialLoanContract); //
    partialLoanContract.events.AddCollateral({}, async (error, event) => {
        try {
            if (!error) {
                console.log("****** AddCollateralEvent ********")
                console.log(event.returnValues)
                logger.log('info','AddCollateralEvent_str Called with : %s', JSON.stringify(event))
                await createAddCollateralDeposit(event.returnValues) //
            } else {
                console.error(error);
            }
        }
        catch (err) {
            logger.log('error','AddCollateralEvent retuened Error : %s', JSON.stringify(err))
            console.error(err);
        }
    })
}


const collatralReleasedEvent = (partialLoanContract) => {
   // console.log("Listening to collatralReleasedEvent event", partialLoanContract); //
                               
    partialLoanContract.events.WithdrawCollateral({}, async (error, event) => {
        try {
            if (!error) {
                console.log("****** contractReleasedEvent ********")
                console.log(event.returnValues)
                logger.log('info','collatralReleasedEvent_str Called with : %s', JSON.stringify(event))
                await createCollateralReleased(event.returnValues) //
            } else {
                console.error(error);
            }
        }
        catch (err) {
            logger.log('error','collatralReleasedEvent retuened Error : %s', JSON.stringify(err))
            console.error(err);
        }
    })
}

module.exports = {
    listenToEvents
}