const express = require('express')
const router = express.Router()

module.exports = router


function flat(splitInfo, balance, result) {
    /*
        * @desc computes data for all FLAT types
        * @param int $splitCount - loop counter or state.
        * @param Obj $splitInfo - All split info.
        * @param int $balance - Initial balance.
        * @param array $result - an array to sotre individual SplitBreakdown.
    */
   
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
    /*
        * @desc computes data for all PERCENTAGE types
        * @param int $splitCount - loop counter or state.
        * @param Obj $splitInfo - All split info.
        * @param int $balance - Initial balance.
        * @param array $result - an array to sotre individual SplitBreakdown.
        * @param int $splitValue - result of calc the percentage of a SplitValue.
    */

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

    /*
        * @desc computes data for all RATIO types.
        * @param int $totalRatio - Total of all the ration SplitValue.
        * @param int $ratioBalance - static balance for calculating ratio.
        * @param int $splitCount - loop counter or state.
        * @param Obj $splitInfo - All split info.
        * @param int $balance - Initial balance.
        * @param array $result - an array to sotre individual SplitBreakdown.
        * @param int $amount - result of calc the ratio of a SplitValue.
    */

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

    /*
        * @desc An endpoint to compute split information.
    */

    const id = req.body.ID
    let amount = req.body.Amount
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
