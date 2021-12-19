const { liquidationTrigger } = require("../web3/oracleopen");

const triggerLiquidation = async (req, res) => {
    try {
        await liquidationTrigger("0x751C9A479498f0634e3A1114DA493B36bf31854F", "1")
        res.status(200).send("Triggerred")
    } catch(err) {
        console.error(err)
        res.status(500).send({
            error: err.message
        });
    }
}

module.exports = {
    triggerLiquidation
}