const fs = require('fs')
const path = require('path')

function readSql(fileName) {
    const filePath = path.join(__dirname, '..', fileName)
    return fs.readFileSync(filePath, 'utf-8')
}

module.exports = { readSql }