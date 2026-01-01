import cron from 'node-cron'
import { processRegulars } from '../controllers/regulars.js'

cron.schedule('0 */6 * * *', async () => {
    try {
        let timeNow = new Date()
        console.log(`[${timeNow.toISOString()}][Scheduler - Regular Expenses]: started`)
        await processRegulars()
        timeNow = new Date()
        console.log(`[${timeNow.toISOString()}][Scheduler - Regular Expenses]: finished`)
    } catch (error) {
        const timeNow = new Date()
        console.error(`[${timeNow.toISOString()}][Scheduler - Regular Expenses] ERROR: ${error}`)
    }
})