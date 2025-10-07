import RegularExpense from './RegularExpense'
import { useQuery } from '@tanstack/react-query'
import { getRegulars } from '../apiService/regulars'

export default function RegularExpensesList() {
    const query = useQuery({ queryKey: ['regulars'], queryFn: getRegulars })

    return (
        <div className="regular-expenses-list list-column">
            {query.data?.map(regular => {
                return <RegularExpense data={regular} key={regular.id} />
            })}
        </div>
    )
}