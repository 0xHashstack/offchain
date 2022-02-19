const { addLiquidation } = require('../controllers/liquidation-controller');
const { getLoan } = require('../controllers/loan-controller');
const { add } = require('../utils/logger');
const { liquidationTrigger } = require('../web3/LoanExt');

const checkIfAnyLoanHasToBeLiquidated = async () => {
    let loanDetails = await getLoan();
    // console.log("All Loans: ", loanDetails);
    loanDetails.forEach(async (loan) => {
        // Calculate liquidation price
        let liquidationPrice;
        if (loan.debtCategory == 1) {
            liquidationPrice = loan.loanAmount + 0.06 * loan.collateralAmount;
        } else if (loan.debtCategory == 2) {
            liquidationPrice = loan.loanAmount + 0.084 * loan.collateralAmount;
        } else {
            liquidationPrice = loan.loanAmount + 0.108 * loan.collateralAmount;
        }

        //Calculate liquidation call price
        let liquidationCallPrice = liquidationPrice + 0.03 * loan.collateralAmount;

        if (liquidationCallPrice == loan.collateralAmount) {
            try {
                let tx = await liquidationTrigger(loan.account, loan.loanMarket, loan.commitment);
                await addLiquidation({
                    account: loan.account,
                    loanMarket: loan.loanMarket,
                    commitment: loan.commitment
                });
                return tx;
            } catch(error) {
                throw error;
            }
        }
    });
}

// const liquidateLoan=async(req, res, next)=>{
//     try {
//         const account = req.query.account;
//         const loanMarket=req.query.loanMarket;
//         const commitment=req.query.commitment
//         console.log (account,loanMarket,commitment)
//         try {
//             let tx = await liquidationTrigger(account, loanMarket, commitment);
//             await addLiquidation({
//                 account: account,
//                 loanMarket: loanMarket,
//                 commitment: commitment
//             });
//             return tx;
//         } catch(error) {
//             throw error;
//         }
//         return res.status(202).json({
//             success: true,
//             isWhiteListed: false,
//             message: "Liquidation triggered" 
//         })
//     } catch(error) {
//         return res.status(500).json({
//             success: false,
//             error: `Error Getting Account ${req.body.address}: ${error.message}`
//         })
//     }
// }

// const liquidateLoans = () => {
//     setTimeout(checkIfAnyLoanHasToBeLiquidated, 1000);
// }

module.exports = {
    checkIfAnyLoanHasToBeLiquidated
    
}