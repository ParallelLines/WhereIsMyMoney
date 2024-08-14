import ColorMarker from './ColorMarker'

export default function Expense({ data }) {
    const date = new Date(data.date)
    console.log(data)
    return (
        <div className="expense text-standart">
            {data.name} {data.symbol + data.sum} {date.toDateString()}
            <ColorMarker name={data.category_name} color={data.color} />
        </div>
    )
}