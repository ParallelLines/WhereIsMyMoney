const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
const dayNums = {
    'first': 1,
    'second': 2,
    'third': 3,
    'forth': 4,
    'fifth': 5
}

/**
 * compares only day, month, year, without time.
 * 
 * @param {String} string1 a date string from which an object Date could be created (also it might be a Date object itself, anything the Date constructor accepts).
 * @param {String} string2 the same as string 1.
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

/**
 * 
 * @param {String} dateString '2030-11-12T16:57:16.516Z' for example
 * @param {Number} yearsNum   how many years to add to the date in dateString; 69, for example
 * @returns {String} the same string but with added yearsNum
 */
function addYears(dateString, yearsNum) {
    const date = new Date(dateString)
    date.setFullYear(date.getFullYear() + yearsNum)
    return date.toISOString()
}

function isWeekdayInArray(dayNum, weekdaysArr) {
    return weekdaysArr.includes(weekdays[dayNum])
}

function isMonthInArray(monthNum, monthsArr) {
    return monthsArr.includes(months[monthNum])
}

/**
 * TODO: throw error instead of returning null
 * 
 * @param {Number} currWeekday 0-6 for Sun-Sat accordingly. 
 * @param {[String]} weekdaysArr  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].
 * @returns {Number} 0-6 if the day was found, or null if nothing was found. But it should not return null, unless the weekdaysArr is empty, which also should not happen.
 */
function findNextWeekday(currWeekday, weekdaysArr) {
    for (let i = 1; i < 7; i++) {
        const dayNum = (currWeekday + i) % 7
        if (isWeekdayInArray(dayNum, weekdaysArr)) return dayNum
    }
    return null
}

/**
 * 
 * @param {Number} currDay   1-31.
 * @param {[Number]} daysArr [23, 1, 13], an array of numbers in range 1-31, not neccessarily sorted.
 * @returns 
 */
function findNextDayInMonth(currDay, daysArr) {
    daysArr.sort((a, b) => a - b)
    for (let day of daysArr) {
        if (day > currDay) return day
    }
    return daysArr[0]
}

/**
 * 
 * @param {Number} currMonth   0-11 for Jan-Dec accordingly.
 * @param {[String]} monthsArr ['Jan', 'Sept'], an array of months.
 */
function findNextMonth(currMonth, monthsArr) {
    for (let i = 1; i <= 12; i++) {
        const month = (currMonth + i) % 12
        if (monthsArr.includes(months[month])) return month
    }
    return null
}

/**
 * Finds the day of the week on the last day of the month with numOfDaysInMonth days in it.
 * 
 * @param {Number} numOfDaysInMonth   1-31.
 * @param {Number} startOfTheMonthDay 0-6 for the Mon-Sun accordingly - the number means the day of the week on the 1st day of a given month.
 * @returns 
 */
function findEndOfTheMonthDay(numOfDaysInMonth, startOfTheMonthDay) {
    return (numOfDaysInMonth + startOfTheMonthDay - 1) % 7
}

/**
 * 
 * @param {Number} currWeekday      0-6 for Sun-Sat accordingly. 
 * @param {Array[String]} weekdays  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].
 * @returns {Boolean} true, if this week has more days after currWeekday, and false if it doesn't.
 */
function haveAnotherDayThisWeek(currWeekday, weekdaysArr) {
    const nextDay = findNextWeekday(currWeekday, weekdaysArr)
    return nextDay >= currWeekday
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
            return day === weekdays.indexOf(dayType)
        }
        return countDays(dayNum, numOfDaysInMonth, startOfTheMonthDay, condition)
    }
    console.error(`unknown day type: ${dayType}. Should be one of: Mon, Tue, Wed, Thu, Fri, Sat, Sun, day, weekday, weekend day.`)
    return null
}

function calculateDaily(prevDate, pattern) {
    const now = new Date()
    const startDate = new Date(pattern.start_date)
    if (!prevDate || startDate > now) return startDate
    const nextDate = new Date(prevDate ? prevDate : pattern.start_date)
    const prevDayOfMonth = prevDate.getDate()
    const interval = parseInt(pattern.repeat_every)
    nextDate.setDate(prevDayOfMonth + interval)
    return nextDate
}

function calculateWeekly(prevDate, pattern) {
    const startDate = new Date(prevDate ? prevDate : pattern.start_date)
    const prevDayOfWeek = startDate.getDay()
    if (!prevDate && isWeekdayInArray(prevDayOfWeek, pattern.repeat_each_weekday))
        return startDate
    const prevDayOfMonth = startDate.getDate()
    const interval = prevDate ? parseInt(pattern.repeat_every) : 1
    const closestWeekday = findNextWeekday(prevDayOfWeek, pattern.repeat_each_weekday)
    const shouldUseInterval = !haveAnotherDayThisWeek(prevDayOfWeek, pattern.repeat_each_weekday)
    const diff = weekdayDiff(prevDayOfWeek, closestWeekday)
    const nextDate = new Date(startDate)
    if (shouldUseInterval) {
        nextDate.setDate(prevDayOfMonth + (interval - 1) * 7 + diff)
    } else {
        nextDate.setDate(prevDayOfMonth + diff)
    }
    return nextDate
}

function calculateMonthly(prevDate, pattern) {
    const startDate = new Date(prevDate ? prevDate : pattern.start_date)
    const prevDay = startDate.getDate()
    const prevMonth = startDate.getMonth()
    const prevYear = startDate.getFullYear()
    const interval = prevDate ? parseInt(pattern.repeat_every) : 1
    if (pattern.repeat_each_day_of_month) {
        if (!prevDate && pattern.repeat_each_day_of_month.includes(prevDay))
            return startDate
        const closestDay = findNextDayInMonth(prevDay, pattern.repeat_each_day_of_month)
        const newMonth = closestDay <= prevDay ? (prevMonth + interval) % 12 : prevMonth
        const yearDiff = closestDay <= prevDay ? Math.floor((prevMonth + interval) / 12) : 0
        const newYear = prevYear + yearDiff
        const daysInNewMonth = daysInMonth(newMonth, newYear)
        const newDay = Math.min(closestDay, daysInNewMonth)
        const nextDate = new Date(startDate)
        nextDate.setFullYear(newYear)
        nextDate.setMonth(newMonth, newDay)
        return nextDate
    } else {
        const dayNum = pattern.repeat_on_day_num
        const dayType = pattern.repeat_on_weekday
        let newDate = findDate(dayNum, dayType, prevMonth, prevYear)
        if (!prevDate && prevDay === newDate)
            return startDate
        if (newDate <= prevDay) {
            const newMonth = (prevMonth + interval) % 12
            const yearDiff = Math.floor((prevMonth + interval) / 12)
            const newYear = prevYear + yearDiff
            newDate = findDate(dayNum, dayType, newMonth, newYear)
            if (!prevDate && prevDay === newDate)
                return startDate
            const nextDate = new Date(startDate)
            nextDate.setFullYear(newYear)
            nextDate.setMonth(newMonth, newDate)
            return nextDate
        }
        const nextDate = new Date(startDate)
        nextDate.setDate(newDate)
        return nextDate
    }
}

function calculateYearly(prevDate, pattern) {
    const interval = parseInt(pattern.repeat_every)
    const nextDate = new Date(pattern.start_date)

    if (prevDate) {
        const startDate = new Date(pattern.start_date)
        const fixedDate = startDate.getDate()
        const prevMonth = prevDate.getMonth()
        const prevYear = prevDate.getFullYear()
        const nextMonth = findNextMonth(prevMonth, pattern.repeat_each_month)
        const nextYear = nextMonth <= prevMonth ? prevYear + interval : prevYear
        const daysInNextMonth = daysInMonth(nextMonth, nextYear)
        let finalDate = Math.min(fixedDate, daysInNextMonth)
        if (pattern.repeat_on_day_num) {
            const dayNum = pattern.repeat_on_day_num
            const dayType = pattern.repeat_on_weekday
            finalDate = findDate(dayNum, dayType, nextMonth, nextYear)
        }
        nextDate.setFullYear(nextYear)
        nextDate.setMonth(nextMonth, finalDate)
    } else {
        const startDate = new Date(pattern.start_date)
        const fixedDate = startDate.getDate()
        const prevMonth = startDate.getMonth()
        const prevYear = startDate.getFullYear()
        const nextMonth = findNextMonth(prevMonth, pattern.repeat_each_month)
        const nextYear = nextMonth <= prevMonth ? prevYear + interval : prevYear
        const daysInPrevMonth = daysInMonth(prevMonth, prevYear)
        let finalDate = Math.min(fixedDate, daysInPrevMonth)
        if (pattern.repeat_on_day_num) {
            const dayNum = pattern.repeat_on_day_num
            const dayType = pattern.repeat_on_weekday
            finalDate = findDate(dayNum, dayType, prevMonth, prevYear)
            if (finalDate < fixedDate) {
                finalDate = findDate(dayNum, dayType, nextMonth, nextYear)
                nextDate.setFullYear(nextYear)
                nextDate.setMonth(nextMonth, finalDate)
                return nextDate
            }
        }
        nextDate.setFullYear(prevYear)
        nextDate.setMonth(prevMonth, finalDate)
    }
    return nextDate
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
    const endDate = pattern.end_date ? new Date(pattern.end_date) : null
    const freq = pattern.repeat_interval

    if (endDate && now > endDate) return null
    if (prevDate && datesEqual(now, prevDate)) return prevDate

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

    if (!endDate) return nextDate
    return nextDate < endDate || datesEqual(nextDate, endDate) ? nextDate : null
}

export { datesEqual, addYears, calculateNextDate }