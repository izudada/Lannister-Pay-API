const express = require('express')
const router = express.Router()

module.exports = router


function flat(splitInfo, balance, result) {
    for(let splitCount = 0; splitCount < splitInfo.length; splitCount++) {
        if (splitInfo[splitCount].SplitType == 'FLAT') {
            result.push({
                "SplitEntityId": splitInfo[splitCount].SplitEntityId,
                "Amount": splitInfo[splitCount].SplitValue
            })
            balance = balance - splitInfo[splitCount].SplitValue
        } 
    }
    return balance
}

function percentage(splitInfo, balance, result) {
    for(let splitCount = 0; splitCount < splitInfo.length; splitCount++) {
        if (splitInfo[splitCount].SplitType == 'PERCENTAGE') {
            let splitValue = (splitInfo[splitCount].SplitValue * balance) / 100
            result.push({
                "SplitEntityId": splitInfo[splitCount].SplitEntityId,
                "Amount": splitValue
            })
            balance = balance - splitValue
        } 
    }
    return balance
}

function ratio(splitInfo, balance, result) {
    let totalRatio = 0
    let ratioBalance = balance
    for(let splitCount = 0; splitCount < splitInfo.length; splitCount++) {
        if (splitInfo[splitCount].SplitType == 'RATIO') {
            totalRatio = totalRatio + splitInfo[splitCount].SplitValue
        }
    }

    for(let splitCount = 0; splitCount < splitInfo.length; splitCount++) {
        if (splitInfo[splitCount].SplitType == 'RATIO') {
            const amount = (splitInfo[splitCount].SplitValue/totalRatio) * ratioBalance
            result.push({
                "SplitEntityId": splitInfo[splitCount].SplitEntityId,
                "Amount": amount
            })
            balance = balance - amount
        }
    }
    return balance
}

router.post('/compute', (req, res) => {
    const id = req.body.ID
    let amount = req.body.Amount
    const currency = req.body.Currency
    const splitInfo = req.body.SplitInfo
    var balance = req.body.Amount
    var result = []


    balance = flat(splitInfo, balance, result)

    balance = percentage(splitInfo, balance, result)

    balance = ratio(splitInfo, balance, result)

    res.send(JSON.stringify(
        {
            "ID": id,
            "Balance": balance,
            "SplitBreakdown": result
        }
    ))
})
