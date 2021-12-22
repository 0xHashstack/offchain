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