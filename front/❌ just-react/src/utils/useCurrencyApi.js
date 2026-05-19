import { useState } from 'react'
import { getCurrencies } from './apiService'

export default function useCurrencyApi() {
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)

    const getAll = async () => {
        setLoading(true)
        return getCurrencies()
            .catch(e => {
                console.log('Error trying to request currencies: ', e)
                setError('couldn\'t get the data :(')
            })
            .finally(() => setLoading(false))
    }

    return { getAll, loading, error }
}