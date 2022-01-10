const rpcURLs = {
    "infuraKovan": "https://kovan.infura.io/v3/99b8947af7e14278ae235bb21eb81f53",
    "infuraRopsten": "wss://ropsten.infura.io/ws/v3/84787fdf8ce842f0a2c41131de1ef5e9",
    "binanceTestnet": "wss://speedy-nodes-nyc.moralis.io/0333c1541db7fd868fd97aa8/bsc/testnet/ws"
}

const diamondAddress = "0xAA5381caF774a92d38ADD5eb5F4c6e26c3939C62";

const chain = "0x61"

const symbols = {
    "0x555344542e740000000000000000000000000000000000000000000000000000": "USDT.t",
    "0x555344432e740000000000000000000000000000000000000000000000000000": "USDC.t",
    "0x4254432e74000000000000000000000000000000000000000000000000000000": "BTC.t",
}

module.exports = {
    rpcURLs,
    diamondAddress,
    chain,
    symbols
}