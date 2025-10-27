import { dateString, dateTimeString } from '../utils/date'
import ColorMarker from './ColorMarker'
import IconEdit from './icons/IconEdit'
import IconDelete from './icons/IconDelete'

export default function Expense({ data }) {
    return (
        <div className="expense">
            <input className="invisible-column" type="checkbox"></input>
            <span className="expense-name" title={data.name}>{data.name}</span>
            <span className="expense-sum">{data.sum}</span>
            <span className="expense-currency">{data.symbol}</span>
            <span className="expense-date" title={dateTimeString(data.date)}>{dateString(data.date)}</span>
            <ColorMarker name={data.category_name} color={data.color} />
            <span className="invisible-column">
                <button
                    className="icon-btn invisible-ctrl"
                    title="Edit">
                    <IconEdit />
                </button>
                <button
                    className="icon-btn invisible-ctrl"
                    title="Delete">
                    <IconDelete />
                </button>
            </span>
        </div>
    )
}