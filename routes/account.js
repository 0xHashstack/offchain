const { addAccountAPI, whiteListAccount } = require("../controllers/account-controller")
const reader = require('xlsx')

const addNewAccount = async (req, res) => {
    await addAccountAPI(req, res);
}

const whiteListAddedAccount = async (req, res) => {
    await whiteListAccount(req, res);
}

const addAccountsFromExcel = async () => {
    const file = reader.readFile('./test.xlsx')
    let data = []
  
    const sheets = file.SheetNames
      
    for(let i = 0; i < sheets.length; i++) {
       const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]])
       temp.forEach((res) => {
          data.push(res)
       })
    }
    console.log(data)

}


// addAccountsFromExcel()
module.exports = {
    addNewAccount,
    whiteListAddedAccount
}