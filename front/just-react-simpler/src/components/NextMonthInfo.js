import { useFetchCurrencies, useFetchNextMonthRegularStats } from '../utils/reactQueryHooks'

export default function NextMonthInfo() {
    const query = useFetchNextMonthRegularStats()
    const currenciesQuery = useFetchCurrencies()

    const prepareData = () => {
        if (!query.data || !currenciesQuery.data) return []
        const data = []
        for (let currency in query.data) {
            const currencyData = currenciesQuery.data.find(curr => curr.name === currency)
            data.push({
                currency: currency,
                symbol: currencyData.symbol,
                sum: query.data[currency]
            })
        }
        data.sort((a, b) => b.sum - a.sum)
        return data
    }

    const preparedData = prepareData()

    return (
        <div className='next-month-info'>
            {query.isLoading && <div>Loading...</div>}
            {query.isError && <div>Error: {query.error.message}</div>}
            {preparedData.length > 0 &&
                <>
                    next month will be debited:
                    <div className='next-month-info-list'>
                        {preparedData.map((record, id) => (
                            <div className='next-month-info-record' key={id}>
                                {record.sum} {record.symbol}
                            </div>
                        ))}
                    </div>
                </>
            }
            {preparedData.length === 0 &&
                <>
                    you have no recurrent expenses
                </>
            }

        </div>
    )
}