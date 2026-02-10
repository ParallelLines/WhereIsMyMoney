/**
 * 
 * @param {String} dateStr a string like 2024-06-05T05:33:00.000Z or whatever is suitable for Date()
 * @returns {String} a string in a dd/MM/YYYY format
 */
export function dateString(dateStr) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
}

/**
 * 
 * @param {String} dateStr a string like 2024-06-05T05:33:00.000Z or whatever is suitable for Date()
 * @returns {String} a string in a yyyy-mm-dd format
 */
export function formatDateForDateInput(dateStr) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * 
 * @param {String} dateStr a string like 2024-06-05T05:33:00.000Z or whatever is suitable for Date()
 * @returns {String} a string in a "dd.MM.YYYY hh:mm" format
 */
export function dateTimeString(dateStr) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
}

/**
 * it used to be dateStr of 2024-06-05T05:33:00.000Z format (just like in postgresql), 
 * and one could pass to the function date.toISOString()
 * but the method gives the wrong hours (UTC), so it is no use
 * 
 * @param {Date} date date should be a Date Object
 * @returns {String} a string in the following format YYYY-MM-DDTHH:mm
 */
export function formatDateForInput(date) {
    // const strArr = dateStr.split(':')
    // return strArr[0] + ':' + strArr[1]
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * 
 * @param {String} dateStr a string in the 'yyyy-mm-dd' format
 * @returns {Date} a Date object with current time, but with the Day, Month and Year from the dateStr
 */
export function convertDateToDatetime(dateStr) {
    const now = new Date()
    const date = new Date(dateStr)
    now.setFullYear(date.getFullYear())
    now.setMonth(date.getMonth(), date.getDate())
    return now
}

/**
 * 
 * @param {Number} monthOffset 0-12, indicates an offset from the current month back in past (not in future!)
 * @returns {Object} an object like {month: 3, year: 1995, name: 'Apr'}, where month = 0-11 for Jan-Dec
 */
export function getMonthYearByOffset(monthOffset) {
    if (monthOffset === null || monthOffset === undefined) {
        return {
            month: null,
            name: null,
            year: null
        }
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    let month = currentMonth - monthOffset
    if (monthOffset > currentMonth) {
        month = 12 - Math.abs(currentMonth - monthOffset)
    }
    let year = currentYear
    const offsetBeforePrevYear = currentMonth + 1
    if (monthOffset >= offsetBeforePrevYear) {
        year = currentYear - 1
    }
    return {
        month: month,
        name: months[month],
        year: year
    }
}