import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default function readSql(fileName) {
    const filePath = path.join(__dirname, '..', fileName)
    return fs.readFileSync(filePath, 'utf-8')
}