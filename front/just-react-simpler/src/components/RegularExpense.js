import { dateString } from "../utils/date";

export default function RegularExpense({ data }) {
    return (
        <div className="regular-expense">
            <span>{data.name}</span>
            <span>{data.sum}</span>
            <span title={data.currency}>{data.symbol}</span>
            <span>next: {dateString(data.next_date)}</span>
        </div>
    )
}