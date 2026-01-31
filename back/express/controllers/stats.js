import db from '../db.js'

export async function getPieStats(req, res) {
    const { userId } = req
    const stats = await db.query(db.stats.getForPie, [userId])
    calculateSumsWithChildren(stats.rows)
    calculateAllTimeSum(stats.rows)
    res.json(stats.rows)
}

function calculateAllTimeSum(categories) {
    for (let category of categories) {
        category.all_time_sum_inUSD = category.all_time_sums.reduce((acc, curr) => acc += curr.sum_inUSD, 0)
        category.all_time_sum_with_children_inUSD = category.all_time_sums.reduce((acc, curr) => acc += curr.sum_with_children_inUSD ? curr.sum_with_children_inUSD : curr.sum_inUSD, 0)
        for (let monthSum of category.last_months_sums) {
            monthSum.sum_inUSD = monthSum.currencies.reduce((acc, curr) => acc += curr.sum_inUSD, 0)
            monthSum.sum_with_children_inUSD = monthSum.currencies.reduce((acc, curr) => acc += curr.sum_with_children_inUSD ? curr.sum_with_children_inUSD : curr.sum_inUSD, 0)
        }
    }
}

function calculateSumsWithChildren(categories) {
    let level = findMaxLevel(categories)
    while (level > 0) {
        const currentLevelCategories = categories.filter(c => c.level === level)
        for (let category of currentLevelCategories) {
            const children = categories.filter(c => c.parent_id === category.id)
            for (let child of children) {
                category.all_time_sums = sumCurrencies(category.all_time_sums, child.all_time_sums)
                for (let i = 0; i < Math.max(category.last_months_sums.length, child.last_months_sums.length); i++) {
                    const arr1 = category.last_months_sums.length > 11 ? category.last_months_sums[i].currencies : []
                    const arr2 = child.last_months_sums.length > 11 ? child.last_months_sums[i].currencies : []
                    category.last_months_sums[i] = {
                        month_num: getMonthNum(category, child, i),
                        currencies: [...sumCurrencies(arr1, arr2)]
                    }
                }
            }
        }
        level--
    }
}

function getMonthNum(category1, category2, i) {
    if (category1.last_months_sums.length > 11) return category1.last_months_sums[i].month_num
    if (category2.last_months_sums.length > 11) return category2.last_months_sums[i].month_num
    return null
}

function findMaxLevel(categories) {
    if (!categories.length) return -1
    let maxLevel = categories[0].level
    for (let category of categories) {
        if (category.level > maxLevel) maxLevel = category.level
    }
    return maxLevel
}

function sumCurrencies(arr1, arr2) {
    const result = []
    if (!arr1.length) {
        for (let curr of arr2) {
            result.push({
                ...curr,
                sum: 0,
                sum_inUSD: 0,
                sum_with_children: curr.sum_with_children ? curr.sum_with_children : curr.sum,
                sum_with_children_inUSD: curr.sum_with_children_inUSD ? curr.sum_with_children_inUSD : curr.sum_inUSD
            })
        }
        return result
    }

    if (!arr2.length) {
        for (let curr of arr1) {
            result.push({
                ...curr,
                sum_with_children: curr.sum_with_children ? curr.sum_with_children : curr.sum,
                sum_with_children_inUSD: curr.sum_with_children_inUSD ? curr.sum_with_children_inUSD : curr.sum_inUSD
            })
        }
        return result
    }

    for (let curr of arr1) {
        result.push({
            ...curr
        })
    }

    for (let curr2 of arr2) {
        let found = false
        for (let curr1 of result) {
            if (curr1.name === curr2.name) {
                found = true
                let withChildren = curr1.sum_with_children ? curr1.sum_with_children : curr1.sum
                withChildren += curr2.sum_with_children ? curr2.sum_with_children : curr2.sum
                let withChildrenUSD = curr1.sum_with_children_inUSD ? curr1.sum_with_children_inUSD : curr1.sum_inUSD
                withChildrenUSD += curr2.sum_with_children_inUSD ? curr2.sum_with_children_inUSD : curr2.sum_inUSD
                curr1.sum_with_children = withChildren
                curr1.sum_with_children_inUSD = withChildrenUSD
                break
            }
        }
        if (!found) {
            result.push({
                ...curr2,
                sum: 0,
                sum_inUSD: 0,
                sum_with_children: curr2.sum_with_children ? curr2.sum_with_children : curr2.sum,
                sum_with_children_inUSD: curr2.sum_with_children_inUSD ? curr2.sum_with_children_inUSD : curr2.sum_inUSD
            })
        }
    }
    return result
}