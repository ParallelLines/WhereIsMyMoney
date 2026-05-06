export function filterAccordingToLevel(selectedCategory, data) {
    if (!data) return
    if (selectedCategory !== null) {
        return data.filter(d => d.id === selectedCategory || d.parent_id === selectedCategory)
    }
    return data.filter(d => d.parent_id === null)
}

/**
 * Input looks like an array of such objects:
 {
    "id": "15",
    "parent_id": null,
    "name": "living",
    "level": 1,
    "color": "49bf04",
    "last_months_sums": [
        {
            "month_num": 4,
            "currencies": [
                {
                    "sum": 10,
                    "name": "EUR",
                    "symbol": "€",
                    "sum_inUSD": 11.73,
                    "sum_with_children": 1028.17,
                    "sum_with_children_inUSD": 1206.49
                }, {
                    "sum": 0,
                    "name": "RUB",
                    "symbol": "₽",
                    "sum_inUSD": 0,
                    "sum_with_children": 99,
                    "sum_with_children_inUSD": 1.32
                }, {
                    "sum": 0,
                    "name": "PLN",
                    "symbol": "zł",
                    "sum_inUSD": 0,
                    "sum_with_children": 12,
                    "sum_with_children_inUSD": 3.31
                }
            ],
            "sum_inUSD": 11.73,
            "sum_with_children_inUSD": 1211.12
        },
        {
            "month_num": 3,
            ...
        },
        ...
    ],
    "all_time_sums": [
        {
            "sum": 10,
            "name": "EUR",
            "symbol": "€",
            "sum_inUSD": 11.73,
            "sum_with_children": 8909.67,
            "sum_with_children_inUSD": 10237.81
        }, {
            "sum": 0,
            "name": "RUB",
            "symbol": "₽",
            "sum_inUSD": 0,
            "sum_with_children": 297,
            "sum_with_children_inUSD": 3.82
        }, {
            "sum": 0,
            "name": "PLN",
            "symbol": "zł",
            "sum_inUSD": 0,
            "sum_with_children": 96,
            "sum_with_children_inUSD": 26.36
        }
    ],
    "all_time_sum_inUSD": 11.73,
    "all_time_sum_with_children_inUSD": 10267.99
}
 * 
 * the point of this function is to add sumUSD and sums fields, which contain only necessary values 
 * according to the current selectedCategory and monthOffset
 * 
 * @param {Array} data 
 * @returns {Array} 
 */
export function preparePieData(selectedCategory, monthOffset, data) {
    if (!data) return
    const preparedData = []
    for (let category of data) {
        const newData = JSON.parse(JSON.stringify(category))
        if (category.id === selectedCategory) {
            // without children
            if (monthOffset === null) {
                // using all_time_sums
                newData.sumUSD = newData.all_time_sum_inUSD
                newData.sums = [...newData.all_time_sums]
            } else {
                // using last_months_sums
                const monthSums = newData.last_months_sums[monthOffset]
                newData.sumUSD = monthSums ? monthSums.sum_inUSD : 0
                newData.sums = monthSums ? monthSums.currencies : []
            }
        } else {
            // with children
            if (monthOffset === null) {
                // using all_time_sums
                newData.sumUSD = newData.all_time_sum_with_children_inUSD
                newData.sums = [...newData.all_time_sums]
            } else {
                // using last_months_sums
                const monthSums = newData.last_months_sums[monthOffset]
                newData.sumUSD = monthSums ? monthSums.sum_with_children_inUSD : 0
                newData.sums = monthSums ? monthSums.currencies : []
            }
        }
        preparedData.push(newData)
    }
    return preparedData
}

/**
 * Sums up all the data[].sums according to currencies.
 * 
 * @param {String} selectedCategory example: '15'.
 * @param {Array} data an array of only those categories, which should be shown at the moment according to selectedCategory and monthOffset
 *                     and are already prepared by the preparePieData function.
 * @returns an array of objects, each containing name ("EUR"), symbol ("€"), sum (1056.15), sum_inUSD (1239.28), and other fields like sum_with_children, which are not guaranteed.
 */
function caclulatePieTotal(selectedCategory, data) {
    const result = []
    for (let category of data) {
        const sumName = category.id === selectedCategory ? 'sum' : 'sum_with_children'
        const sumUSDName = category.id === selectedCategory ? 'sum_inUSD' : 'sum_with_children_inUSD'
        for (let sum of category.sums) {
            const currency = result.find(c => c.name === sum.name)
            if (currency) {
                currency.sum += sum[sumName] ? sum[sumName] : sum.sum
                currency.sum_inUSD += sum[sumUSDName] ? sum[sumUSDName] : sum.sum_inUSD
            } else {
                const newCurrency = { ...sum }
                newCurrency.sum = sum[sumName] ? sum[sumName] : sum.sum
                newCurrency.sum_inUSD = sum[sumUSDName] ? sum[sumUSDName] : sum.sum_inUSD
                result.push(newCurrency)

            }
        }
    }
    return result
}

/**
 * Takes final data, calculates total sums (for each currency), sorts according to sum_inUSD in descending order and creates an array of strings ready to display.
 * 
 * @param {String} selectedCategory example: '15'.
 * @param {Array} data an array of only those categories, which should be shown at the moment according to selectedCategory and monthOffset
 *                     and are already prepared by the preparePieData function.
 * @returns an array of strings such as like '1056.15 €', '99.00 ₽', etc.
 */
export function displayPieTotal(selectedCategory, data) {
    if (!data) return []
    const totals = caclulatePieTotal(selectedCategory, data)
    const totalsSorted = totals.sort((a, b) => b.sum_inUSD - a.sum_inUSD)
    const totalsFiltered = totalsSorted.filter(sum => sum.sum > 0)
    return totalsFiltered?.map(t => `${t.sum.toFixed(2)} ${t.symbol}`)
}