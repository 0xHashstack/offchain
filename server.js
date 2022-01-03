const express = require("express");
const mongoose = require('mongoose');
const { listenToEvents } = require("./web3/events");
const { liquidateLoans } = require("./web3/liquidation");

let app = express();

const db = process.env.MONGO_URI;

if (db !== '') {
  mongoose
    .connect(
      db,
      { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', require('./routes/index.js'));

app = listenToEvents(app);

liquidateLoans()

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));