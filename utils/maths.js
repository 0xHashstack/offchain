const { APYFromHash, epochLength, APYFromString, decimalBasedOnMarket, decimalBasedOnMarketHash } = require("../constants/constants");
const BigNumber = require('bignumber.js');

exports.calculateMean = (dataArray) => {
    let priceMean = 0;
    let quantityMean = 0;
    dataArray.forEach(data => {
        priceMean += Number(data[0]);
        quantityMean += Number(data[1]);
    });
    priceMean = priceMean/dataArray.length;
    quantityMean = quantityMean/dataArray.length;
    return {
        priceMean,
        quantityMean
    }
}

exports.calculateAcquiredYield = (depositDetails, now) => {
    const { amount, commitment, timestamp, market, lastModified } = depositDetails;
    let numberOfEpochs = (now - new Date(lastModified || timestamp).getTime())/(3 * 1000)
    let apy = commitment.startsWith("0x") ? APYFromHash[commitment] : APYFromString[commitment];
    let apyPerEpoch = (apy * epochLength)/(365*24*60*60);
    let decimal = market.startsWith("0x") ? decimalBasedOnMarketHash[market] : decimalBasedOnMarket[market];
    let amountInNumber = new BigNumber(amount).shiftedBy(-decimal).toNumber();
    return amountInNumber * numberOfEpochs * apyPerEpoch;
}

// console.log(calculateAcquiredYield({"_id":"61dee77ae0846926b3f35dae","account":"0xAcfefBF5558Bfd53076575B3b315E379AFb05260","market":"USDC.t","amount":"10000000000000000000","commitment":"TWOWEEKS","timestamp":"2022-01-12T14:36:34.569Z","__v":0}, new Date().getTime()))