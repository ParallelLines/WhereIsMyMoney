/**
 * date should be a Date Object
 * 
 * it used to be dateStr of 2024-06-05T05:33:00.000Z format (just like in postgresql), 
 * and one could pass to the function date.toISOString()
 * but the method gives the wrong hours (UTC), so it is no use
 * 
 * return YYYY-MM-DDTHH:mm format
 */
export function formatDateForInput(date) {
    //
    // const strArr = dateStr.split(':')
    // return strArr[0] + ':' + strArr[1]

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
}