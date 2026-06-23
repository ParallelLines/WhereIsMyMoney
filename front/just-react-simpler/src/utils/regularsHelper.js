const repeatInterval = ['daily', 'weekly', 'monthly', 'yearly']
const repeatIntervalText = ['day', 'week', 'month', 'year']
const daysOfMonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
const dayNums = ['first', 'second', 'third', 'forth', 'fifth', 'last']
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const weekdaysExtended = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'day', 'weekday', 'weekend day']
const triggerDateChangeFields = new Set(['start_date', 'end_date', 'repeat_interval', 'repeat_every'])

/**
 * 
 * @param {String} intervalStr 
 * @param {any} repeatEveryNum a string or a number
 * @returns {String}
 */
function prepareRepeatEveryText(intervalStr, repeatEveryNum) {
    const idx = repeatInterval.indexOf(intervalStr)
    const text = repeatIntervalText[idx]
    return Number.parseInt(repeatEveryNum) === 1 ? text : text + 's'
}

function getRepeatIntervals() {
    return repeatInterval
}

/**
 * 
 * @param {Number} num 
 * @returns {String}
 */
function getRepeatInterval(num) {
    if (num < 0 || num > repeatInterval.length - 1) return ''
    return repeatInterval[num]
}

/**
 * 
 * @param {Number} num 
 * @returns {String}
 */
function getRepeatIntervalText(num) {
    if (num < 0 || num > repeatIntervalText.length - 1) return ''
    return repeatIntervalText[num]
}

function getDaysOfMonth() {
    return daysOfMonth
}

function getMonths() {
    return months
}

/**
 * 
 * @param {Number} num 
 * @returns {String}
 */
function getMonth(num) {
    if (num < 0 || num > months.length - 1) return ''
    return months[num]
}

function getDayNums() {
    return dayNums
}

/**
 * 
 * @param {Number} num 
 * @returns {String}
 */
function getDayNum(num) {
    if (num < 0 || num > dayNums.length - 1) return ''
    return dayNums[num]
}

function getWeekdays() {
    return weekdays
}

/**
 * 
 * @param {Number} num 
 * @returns {String}
 */
function getWeekday(num) {
    if (num < 0 || num > weekdays.length - 1) return ''
    return weekdays[num]
}

function getWeekdaysExtended() {
    return weekdaysExtended
}

function getPatternText(pattern) {
    const idx = repeatInterval.indexOf(pattern.repeat_interval)
    if (idx === -1) return ''
    const interval = repeatIntervalText[idx]
    let result = 'repeats every ' + pattern.repeat_every + ' ' + interval
    if (pattern.repeat_every > 1) result += 's'
    if (idx === 1) {
        const weekdays = pattern.repeat_each_weekday.replace('{', '').replace('}', '').split(',').join(', ')
        result += ' on ' + weekdays
    } else if (idx === 2) {
        if (pattern.repeat_on_day_num) {
            result += ' on ' + pattern.repeat_on_day_num + ' ' + pattern.repeat_on_weekday
        } else {
            const monthDays = pattern.repeat_each_day_of_month.join(', ')
            result += ' on the ' + monthDays
        }
    } else if (idx === 3) {
        const months = pattern.repeat_each_month.replace('{', '').replace('}', '').split(',').join(', ')
        result += ' in ' + months
        if (pattern.repeat_on_day_num) {
            result += ' on ' + pattern.repeat_on_day_num + ' ' + pattern.repeat_on_weekday
        }
    }
    return result
}

export {
    prepareRepeatEveryText,
    getRepeatIntervals, getRepeatInterval,
    getRepeatIntervalText,
    getDaysOfMonth,
    getMonth, getMonths,
    getDayNum, getDayNums,
    getWeekday, getWeekdays,
    getWeekdaysExtended,
    getPatternText,
}