import cron from 'node-cron'
import { processRegulars } from '../controllers/regulars.js'

cron.schedule('0 */6 * * *', async () => {
    try {
        console.log('[Scheduler - Regular Expenses]: started')
        await processRegulars()
        console.log('[Scheduler - Regular Expenses]: finished')
    } catch (error) {
        console.error('[Scheduler - Regular Expenses] ERROR: ', error)
    }
})