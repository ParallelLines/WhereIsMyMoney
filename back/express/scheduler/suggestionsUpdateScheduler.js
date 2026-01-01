import cron from 'node-cron'
import { updateSuggestionsTable } from '../controllers/suggestions.js'

cron.schedule('0 21 * * *', async () => {
    try {
        let timeNow = new Date()
        console.log(`[${timeNow.toISOString()}][Scheduler - Suggestions]: started`)
        await updateSuggestionsTable()
        timeNow = new Date()
        console.log(`[${timeNow.toISOString()}][Scheduler - Suggestions]: finished`)
    } catch (error) {
        const timeNow = new Date()
        console.error(`[${timeNow.toISOString()}][Scheduler - Suggestions] ERROR: ${error}`)
    }
})