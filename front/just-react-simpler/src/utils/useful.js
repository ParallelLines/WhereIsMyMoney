export function prepareSum(sumStr) {
    let preppedSum = sumStr
    preppedSum = preppedSum.replace(',', '.')
    if (Number.isInteger(parseFloat(preppedSum))) {
        preppedSum = parseFloat(preppedSum) + '.00'
    }
    return preppedSum
}