import cron from 'node-cron'
import { correctUSD } from '../controllers/expenses.js'

cron.schedule('* * * * *', async () => {
    try {
        let timeNow = new Date()
        console.log(`[${timeNow.toISOString()}][Scheduler - USD Corrector]: started`)
        await correctUSD()
        timeNow = new Date()
        console.log(`[${timeNow.toISOString()}][Scheduler - USD Corrector]: finished`)
    } catch (error) {
        const timeNow = new Date()
        console.error(`[${timeNow.toISOString()}][Scheduler - USD Corrector] ERROR: ${error}`)
    }
})