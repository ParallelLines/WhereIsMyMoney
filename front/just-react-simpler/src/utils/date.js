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