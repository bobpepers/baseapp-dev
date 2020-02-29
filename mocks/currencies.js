module.exports = {
    "bch" : {
        "id": "bch",
        "name": "Bitcoin Cash",
        "symbol": "฿",
        "explorer_transaction": "https://www.blocktrail.com/tBCC/tx/#{txid}",
        "explorer_address": "https://www.blocktrail.com/tBCC/address/#{address}",
        "type": "coin",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.01",
        "withdraw_limit_24h": "0.1",
        "withdraw_limit_72h": "0.2",
        "base_factor": 100000000,
        "precision": 8
    },
    "btc" : {
        "id": "btc",
        "name": "Bitcoin",
        "symbol": "฿",
        "explorer_transaction": "https://testnet.blockchain.info/tx/#{txid}",
        "explorer_address": "https://testnet.blockchain.info/address/#{address}",
        "type": "coin",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.005",
        "withdraw_limit_24h": "0.1",
        "withdraw_limit_72h": "0.2",
        "base_factor": 100000000,
        "precision": 8
    },
    "dash" : {
        "id": "dash",
        "name": "Dash",
        "symbol": "Đ",
        "explorer_transaction": "https://test.insight.dash.siampm.com/dash/tx/#{txid}",
        "explorer_address": "https://test.insight.dash.siampm.com/dash/address/#{address}",
        "type": "coin",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.01",
        "withdraw_limit_24h": "0.2",
        "withdraw_limit_72h": "0.5000000000000001",
        "base_factor": 100000000,
        "precision": 8
    },
    "eth" : {
        "id": "eth",
        "name": "Ethereum",
        "symbol": "Ξ",
        "explorer_transaction": "https://rinkeby.etherscan.io/tx/#{txid}",
        "explorer_address": "https://rinkeby.etherscan.io/address/#{address}",
        "type": "coin",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.02",
        "withdraw_limit_24h": "0.2",
        "withdraw_limit_72h": "0.5000000000000001",
        "base_factor": 1e+18,
        "precision": 8
    },
    "eur" : {
        "id": "eur",
        "name": "Euro",
        "symbol": "€",
        "type": "fiat",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.02",
        "withdraw_limit_24h": "2000.0",
        "withdraw_limit_72h": "1000000.0",
        "base_factor": 1,
        "precision": 2
    },
    "ltc" : {
        "id": "ltc",
        "name": "Litecoin",
        "symbol": "Ł",
        "explorer_transaction": "https://chain.so/tx/LTCTEST/#{txid}",
        "explorer_address": "https://chain.so/address/LTCTEST/#{address}",
        "type": "coin",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.01",
        "withdraw_limit_24h": "0.5000000000000001",
        "withdraw_limit_72h": "1.2",
        "base_factor": 100000000,
        "precision": 8
    },
    "trst" : {
        "id": "trst",
        "name": "WeTrust",
        "symbol": "Ξ",
        "explorer_transaction": "https://rinkeby.etherscan.io/tx/#{txid}",
        "explorer_address": "https://rinkeby.etherscan.io/address/#{address}",
        "type": "coin",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.02",
        "withdraw_limit_24h": "300.0",
        "withdraw_limit_72h": "600.0",
        "base_factor": 1000000,
        "precision": 8
    },
    "usd" : {
        "id": "usd",
        "name": "US Dollar",
        "symbol": "$",
        "type": "fiat",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.01",
        "withdraw_limit_24h": "100.0",
        "withdraw_limit_72h": "200.0",
        "base_factor": 1,
        "precision": 2
    },
    "xrp" : {
        "id": "xrp",
        "name": "Ripple",
        "symbol": "ꭆ",
        "explorer_transaction": "https://bithomp.com/explorer/#{txid}",
        "explorer_address": "https://bithomp.com/explorer/#{address}",
        "type": "coin",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.02",
        "withdraw_limit_24h": "100.0",
        "withdraw_limit_72h": "200.0",
        "base_factor": 1000000,
        "precision": 8
    },
    "zar" : {
        "id": "zar",
        "name": "ZAR",
        "symbol": "$",
        "type": "fiat",
        "deposit_fee": "0.0",
        "withdraw_fee": "0.02",
        "withdraw_limit_24h": "100.0",
        "withdraw_limit_72h": "200.0",
        "base_factor": 1,
        "precision": 2
    }
}