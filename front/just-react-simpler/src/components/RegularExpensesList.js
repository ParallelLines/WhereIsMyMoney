import RegularExpense from "./RegularExpense"

const regulars = [
    { id: '1', name: 'HOWOGE', sum: '681.09', currency: 'EUR', symbol: '€', next_date: '2024-12-31 17:57:16.516+01' },
    { id: '2', name: 'Rundfunc', sum: '112', currency: 'EUR', symbol: '€', next_date: '2024-12-31 17:57:16.516+01' }
]

export default function RegularExpensesList() {
    return (
        <div className="regular-expenses-list">
            {regulars.map(regular => {
                return <RegularExpense data={regular} key={regular.id} />
            })}
        </div>
    )
}