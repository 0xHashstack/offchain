const { diamondAddress } = require('../constants/web3');
const Loan = require('../blockchain/abis/Loan1.json');
const { getWeb3 } = require("./transaction");
const { addLoan } = require('../controllers/loan-controller');

const listenToEvents = (app) => {
    const web3 = getWeb3();
    let loanContract = new web3.eth.Contract(
        Loan,
        diamondAddress
    );
    NewLoanEvent(loanContract);
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

// const NewLoanEvent = (loanContract) => {
//     loanContract.events.NewLoan({}, (error, event) => {
//         if (!error) {
//             console.log(event.returnValues)
//             addLoan(event.returnValues);
//         } else {
//             console.error(error);
//         }
//     })
// }

// const NewLoanEvent = (loanContract) => {
//     loanContract.events.NewLoan({}, (error, event) => {
//         if (!error) {
//             console.log(event.returnValues)
//             addLoan(event.returnValues);
//         } else {
//             console.error(error);
//         }
//     })
// }

// const NewLoanEvent = (loanContract) => {
//     loanContract.events.NewLoan({}, (error, event) => {
//         if (!error) {
//             console.log(event.returnValues)
//             addLoan(event.returnValues);
//         } else {
//             console.error(error);
//         }
//     })
// }

// const NewLoanEvent = (loanContract) => {
//     loanContract.events.NewLoan({}, (error, event) => {
//         if (!error) {
//             console.log(event.returnValues)
//             addLoan(event.returnValues);
//         } else {
//             console.error(error);
//         }
//     })
// }

// const NewLoanEvent = (loanContract) => {
//     loanContract.events.NewLoan({}, (error, event) => {
//         if (!error) {
//             console.log(event.returnValues)
//             addLoan(event.returnValues);
//         } else {
//             console.error(error);
//         }
//     })
// }

// const NewLoanEvent = (loanContract) => {
//     loanContract.events.NewLoan({}, (error, event) => {
//         if (!error) {
//             console.log(event.returnValues)
//             addLoan(event.returnValues);
//         } else {
//             console.error(error);
//         }
//     })
// }

module.exports = {
    listenToEvents
}