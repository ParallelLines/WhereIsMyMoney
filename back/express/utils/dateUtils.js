/**
 * compare without time, only day, month, year
 */
function datesEqual(string1, string2) {
    try {
        const date1 = new Date(string1)
        const date2 = new Date(string2)
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
    } catch (e) {
        console.error('exception while comparing dates: ', e)
        return false
    }
}

module.exports = { datesEqual }