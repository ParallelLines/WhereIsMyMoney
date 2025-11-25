/**
 * Compares two arrays. The order matters!.
 * 
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns {Boolean}
 */
function arraysEqual(arr1, arr2) {
    let copy1 = arr1
    let copy2 = arr2
    if (!arr1 || typeof arr1 === 'string') {
        copy1 = parseArray(arr1)
    }
    if (!arr2 || typeof arr2 === 'string') {
        copy2 = parseArray(arr2)
    }

    if (copy1.length !== copy2.length) return false

    for (let i = 0; i < copy1.length; i++) {
        if (copy1[i] !== copy2[i]) return false
    }
    return true
}

/**
 * 
 * @param {String} str a string like '{1,2,3}'
 * @returns {Array} [1, 2, 3]
 */
function parseArray(str) {
    if (!str || str === '{}') return []
    const arr = str.replace('{', '').replace('}', '').split(',')
    if (arr.length && !Number.isNaN(parseInt(arr[0]))) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i])
        }
    }
    return arr
}

module.exports = { arraysEqual }