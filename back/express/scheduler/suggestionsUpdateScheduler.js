import cron from 'node-cron'
import { updateSuggestionsTable } from '../controllers/suggestions.js'

cron.schedule('0 21 * * *', async () => {
    try {
        console.log('[Scheduler - Suggestions]: started')
        await updateSuggestionsTable()
        console.log('[Scheduler - Suggestions]: finished')
    } catch (error) {
        console.error('[Scheduler - Suggestions] ERROR: ', error)
    }
})