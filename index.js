const express = require("express");
const bodyParser = require('body-parser');
const { fetchFairPrice, fetchTokenPrice, fetchPairs } = require("./routes/fairprice");
const { triggerLiquidation } = require("./routes/oracleopen");
const { createWallet } = require("./routes/wallet");


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('Welcome to hashstack finance!')
})

app.get('/fairPrice', fetchFairPrice)
app.get('/tokenPrice', fetchTokenPrice)
app.get('/pairs', fetchPairs)

app.get('/createWallet', createWallet)

app.post('/triggerLiquidation', triggerLiquidation)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})