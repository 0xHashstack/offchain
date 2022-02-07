const { addLiquidation } = require('../controllers/liquidation-controller');
const { getLoan } = require('../controllers/loan-controller');
const { liquidationTrigger } = require('./oracleopen');

const checkIfAnyLoanHasToBeLiquidated = async () => {
    let loanDetails = await getLoan();
    console.log("All Loans: ", loanDetails);
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
                let tx = await liquidationTrigger(loan.account, loan.loanId);
                await addLiquidation({
                    account: loan.account,
                    loanId: loan.loanId
                });
                return tx;
            } catch(error) {
                throw error;
            }
        }
    });
}

// const liquidateLoans = () => {
//     setTimeout(checkIfAnyLoanHasToBeLiquidated, 1000);
// }

module.exports = {
    checkIfAnyLoanHasToBeLiquidated
}