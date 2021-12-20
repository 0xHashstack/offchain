const express = require("express");
const bodyParser = require('body-parser');
const { fetchFairPrice, fetchTokenPrice, fetchPairs } = require("./routes/fairprice");
const { triggerLiquidation } = require("./routes/oracleopen");
const { createWallet } = require("./routes/wallet");
const { listenToEvents } = require("./web3/events");

const app = express();
const URL = process.env.URL || "http://localhost";
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('Welcome to hashstack finance!');
});

app.get('/fairPrice', fetchFairPrice);
app.get('/tokenPrice', fetchTokenPrice);
app.get('/pairs', fetchPairs);

app.get('/createWallet', createWallet);

app.post('/triggerLiquidation', triggerLiquidation);

app = listenToEvents(app);

app.listen(port, () => {
    console.log(`Open Offchain listening at ${URL}:${port}`);
})