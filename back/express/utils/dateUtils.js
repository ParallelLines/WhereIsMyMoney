const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const dayNums = {
    'first': 1,
    'second': 2,
    'third': 3,
    'forth': 4,
    'fifth': 5
}

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

function isNotEmpty(a) {
    return a !== null && a !== undefined && a !== '' && a !== '{}'
}

function exactlyOneExists(a, b, c) {
    const x = isNotEmpty(a)
    const y = isNotEmpty(b)
    const z = isNotEmpty(c)
    return (x && !y && !z) || (!x && y && !z) || (!x && !y && z)
}

/**
 * 
 * @param {Number} currWeekday      0-6 for Sun-Sat accordingly. 
 * @param {[String]} weekdays  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].
 * @returns {Number} 0-6 if the day was found, or null if nothing was found.
 */
function findClosestWeekday(currWeekday, weekdaysArr) {
    for (let i = 1; i < 7; i++) {
        const dayNum = (currWeekday + i) % 7
        if (weekdaysArr.includes(weekdays[dayNum])) return dayNum
    }
    return null
}

/**
 * 
 * @param {Number} currDay   1-31.
 * @param {[Number]} daysArr [23, 1, 13], an array of numbers in range 1-31, not neccessarily sorted.
 * @returns 
 */
function findClosestDayInMonth(currDay, daysArr) {
    daysArr.sort((a, b) => a - b)
    for (let day of daysArr) {
        if (day > currDay) return day
    }
    return daysArr[0]
}

/**
 * Finds the day of the week on the last day of the month with numOfDaysInMonth days in it.
 * 
 * @param {Number} numOfDaysInMonth   1-31.
 * @param {Number} startOfTheMonthDay 0-6 for the Mon-Sun accordingly - the number means the day of the week on the 1st day of a given month.
 * @returns 
 */
function findEndOfTheMonthDay(numOfDaysInMonth, startOfTheMonthDay) {
    return (numOfDaysInMonth % 7 + startOfTheMonthDay - 1) % 7
}

/**
 * 
 * @param {Number} currWeekday      0-6 for Sun-Sat accordingly. 
 * @param {Array[String]} weekdays  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].
 * @returns {Boolean} true, if this week has more days after currWeekday, and false if it doesn't.
 */
function haveAnotherDayThisWeek(currWeekday, weekdaysArr) {
    const nextDay = findClosestWeekday(currWeekday, weekdaysArr)
    return nextDay > currWeekday
}

/**
 * Example: you want to find the diff between 5 ('Fri') and 3 ('Wed') (the order matters!)
 * Then the diff between 5 ('Fri') and 3 ('Wed') will be 5 (6, 0, 1, 2, 3),
 * then the diff between 3 ('Wed') and 5 ('Fri') will be 2 (4, 5).
 * 
 * @param {Number} currDay  0-6 for Sun-Sat accordingly. 
 * @param {Number} nextDay  0-6 for Sun-Sat accordingly.
 * @returns {Number} the difference between the days.
 */
function weekdayDiff(currDay, nextDay) {
    if (currDay < nextDay) return nextDay - currDay
    if (currDay > nextDay) return 7 - currDay + nextDay
    return 0
}

/**
 * TODO: fix it for the two-digit years - must use setFullYear().
 * 
 * @param {Number} month 0-11 for Jan-Dec accordingly.
 * @param {Number} year  2025, for example.
 */
function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate()
}

/**
 * Without any Date objects, this function finds the first-fifth or the last day, weekday or weekend day or a certain day of the week 
 * in a month with numOfDaysInMonth days in it.
 *  
 * @param {String}   dayNum             one of 'first', 'second', 'third', 'forth', 'fifth', 'last'.
 * @param {Number}   numOfDaysInMonth   1-31.
 * @param {Number}   startOfTheMonthDay 0-6 for Sun-Sat accordingly.
 * @param {Function} condition          a function which tells if the day is a 'weekday' or a 'weekend day' or just a 'day' etc.
 * @returns 
 */
function countDays(dayNum, numOfDaysInMonth, startOfTheMonthDay, condition) {
    const endOfTheMonthDay = findEndOfTheMonthDay(numOfDaysInMonth, startOfTheMonthDay)
    if (dayNum === 'last') {
        let currDay = endOfTheMonthDay
        let currDate = numOfDaysInMonth
        while (!condition(currDay)) {
            currDay = currDay - 1 >= 0 ? currDay - 1 : 6
            currDate--
        }
        return currDate
    } else {
        let counter = 0
        let currDay = startOfTheMonthDay - 1
        let currDate = 0
        while (counter < dayNums[dayNum]) {
            currDay = (currDay + 1) % 7
            currDate++
            if (condition(currDay)) {
                counter++
            }
        }
        return currDate
    }
}

/**
 * 
 * @param {String} dayNum  one of 'first', 'second', 'third', 'forth', 'fifth', 'last'.
 * @param {String} dayType one of 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'day', 'weekday', 'weekend day'.
 * @param {Number} month   0-11.
 * @param {Number} year    2025, for example.
 */
function findDate(dayNum, dayType, month, year) {
    const numOfDaysInMonth = daysInMonth(month, year)
    const dateStart = new Date(year, month, 1)
    const startOfTheMonthDay = dateStart.getDay()
    if (dayType === 'day') {
        return dayNum === 'last' ? numOfDaysInMonth : dayNums[dayNum]
    } else if (dayType === 'weekday') {
        const condition = (day) => {
            return day > 0 && day < 6
        }
        return countDays(dayNum, numOfDaysInMonth, startOfTheMonthDay, condition)
    } else if (dayType === 'weekend day') {
        const condition = (day) => {
            return day === 6 || day === 0
        }
        return countDays(dayNum, numOfDaysInMonth, startOfTheMonthDay, condition)
    } else if (weekdays.includes(dayType)) {
        const condition = (day) => {
            console.log('inside the condition...')
            console.log('day = ', day)
            console.log('weekdays.indexOf(dayType) = ', weekdays.indexOf(dayType))
            return day === weekdays.indexOf(dayType)
        }
        return countDays(dayNum, numOfDaysInMonth, startOfTheMonthDay, condition)
    }
    console.error(`unknown day type: ${dayType}. Should be one of: Mon, Tue, Wed, Thu, Fri, Sat, Sun, day, weekday, weekend day.`)
    return null
}

function calculateDaily(prevDate, pattern) {
    const nextDate = new Date(prevDate)
    const prevDayOfMonth = prevDate.getDate()
    const interval = parseInt(pattern.repeat_every)
    nextDate.setDate(prevDayOfMonth + interval)
    return nextDate
}

function calculateWeekly(prevDate, pattern) {
    const prevDayOfWeek = prevDate.getDay()
    const prevDayOfMonth = prevDate.getDate()
    const interval = parseInt(pattern.repeat_every)
    const closestWeekday = findClosestWeekday(prevDayOfWeek, pattern.repeat_each_weekday)
    const shouldUseInterval = !haveAnotherDayThisWeek(prevDayOfWeek, pattern.repeat_each_weekday)
    const diff = weekdayDiff(prevDayOfWeek, closestWeekday)
    const nextDate = new Date(prevDate)
    if (shouldUseInterval) {
        nextDate.setDate(prevDayOfMonth + (interval - 1) * 7 + diff)
    } else {
        nextDate.setDate(prevDayOfMonth + diff)
    }
    return nextDate
}

function calculateMonthly(prevDate, pattern) {
    const interval = parseInt(pattern.repeat_every)
    const prevDay = prevDate.getDate()
    const prevMonth = prevDate.getMonth()
    const prevYear = prevDate.getFullYear()
    if (pattern.repeat_each_day_of_month) {
        const closestDay = findClosestDayInMonth(prevDay, pattern.repeat_each_day_of_month)
        const newMonth = closestDay < prevDay ? (prevMonth + interval) % 12 : prevMonth
        const yearDiff = Math.floor((prevMonth + interval) / 12)
        const newYear = prevYear + yearDiff
        const daysInNewMonth = daysInMonth(newMonth, newYear)
        const newDay = Math.min(closestDay, daysInNewMonth)
        const nextDate = new Date(prevDate)
        nextDate.setFullYear(newYear)
        nextDate.setMonth(newMonth, newDay)
        return nextDate
    } else {
        const dayNum = pattern.repeat_on_day_num
        const dayType = pattern.repeat_on_weekday
        let newDate = findDate(dayNum, dayType, prevMonth, prevYear)
        console.log('the next date could be: ', newDate)
        if (newDate <= prevDay) {
            console.log(`but the ${newDate} is already gone. previous date was: ${prevDay}`)
            console.log('previous month: ', prevMonth)
            const newMonth = (prevMonth + interval) % 12
            console.log('new month: ', newMonth)
            const yearDiff = Math.floor((prevMonth + interval) / 12)
            const newYear = prevYear + yearDiff
            newDate = findDate(dayNum, dayType, newMonth, newYear)
            console.log('new date: ', newDate)
            const nextDate = new Date(prevDate)
            nextDate.setFullYear(newYear)
            nextDate.setMonth(newMonth, newDate)
            console.log(`final next date1: ${nextDate}`)
            return nextDate
        }
        const nextDate = new Date(prevDate)
        nextDate.setDate(newDate)
        console.log(`final next date2: ${nextDate}`)
        return nextDate
    }
}

function calculateYearly(prevDate, pattern) {
    return null
}

/**
 * Calculates a next execution date for the given pattern.
 * 
 * @param {Date} prevDate  the Date of the last execution
 * @param {Object} pattern an object that has: String start_date, String end_date, String repeat_interval, Integer repeat_every, Array[String] repeat_each_weekday, Array[Integer] repeat_each_day_of_month, Array[String] repeat_each_month, String repeat_on_day_num, String repeat_on_weekday.
 * @returns {Date} a Date object containing next date according to the pattern, or null in case the end_date already happend, or -1 in case of an error
 */
function calculateNextDate(prevDate, pattern) {
    const now = new Date()
    const startDate = new Date(pattern.start_date)
    const endDate = new Date(pattern.end_date)
    if (startDate > now) return startDate
    if (now > endDate) return null

    if (!prevDate) return startDate
    if (prevDate && datesEqual(now, prevDate)) return prevDate

    const freq = pattern.repeat_interval
    let nextDate = null
    switch (freq) {
        case 'daily': {
            nextDate = calculateDaily(prevDate, pattern)
            break
        }
        case 'weekly': {
            nextDate = calculateWeekly(prevDate, pattern)
            break
        }
        case 'monthly': {
            nextDate = calculateMonthly(prevDate, pattern)
            break
        }
        case 'yearly': {
            nextDate = calculateYearly(prevDate, pattern)
            break
        }
        default: {
            console.error('unknown repeat interval: ', freq)
            return null
        }
    }
    return nextDate < endDate || datesEqual(nextDate, endDate) ? nextDate : null
}

module.exports = { datesEqual, calculateNextDate }