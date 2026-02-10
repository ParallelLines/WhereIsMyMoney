import RegularExpense from './RegularExpense'
import { useState } from 'react'
import { useFetchRegulars } from '../utils/reactQueryHooks'
import RegularExpenseForm from './RegularExpenseForm'

export default function RegularExpensesList() {
    const [createMode, setCreateMode] = useState(false)

    const query = useFetchRegulars()

    return (
        <div className='regular-expenses-list'>
            <div className='list-ctrls'>
                <button onClick={() => setCreateMode(true)}>+</button>
            </div>
            <div className='list-column'>
                {createMode && <RegularExpenseForm onCancel={() => setCreateMode(false)} onSubmit={() => setCreateMode(false)} />}
                {query.isLoading && <div>Loading...</div>}
                {query.isError && <div>Error: {query.error.message}</div>}
                {query.data?.map(regular => {
                    return <RegularExpense
                        data={regular}
                        key={regular.id}
                    />
                })}
            </div>
        </div>
    )
}