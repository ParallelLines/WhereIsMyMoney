import { dateString } from "../utils/date";

export default function RegularExpense({ data }) {
    return (
        <div className="regular-expense">
            <input type="checkbox"></input>
            <span className="regular-expense-name">{data.name}</span>
            <span className="regular-expense-sum">{data.sum}</span>
            <span className="regular-expense-currency" title={data.currency}>{data.symbol}</span>
            <span className="regular-expense-date">next: {dateString(data.next_date)}</span>
        </div>
    )
}