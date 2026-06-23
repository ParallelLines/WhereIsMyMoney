import { dateString } from '../utils/date'
import VanishingBlock from './VanishingBlock'
import ColorMarker from './ColorMarker'
import { getPatternText } from '../utils/regularsHelper'

export default function RegularExpenseView({ data, onClose, onEdit, onDelete }) {
    const startDateStr = data.start_date ? dateString(data.start_date) : ''
    const endDateStr = data.end_date ? dateString(data.end_date) : 'infinite'
    const nextDateStr = data.next_date ? dateString(data.next_date) : 'never'
    return (
        <VanishingBlock containerClassName='popup-view' background='blur' onClose={onClose}>
            <div className='line'>
                <span className='expense-sum'>{data.sum}</span>
                <span className='expense-currency'>{data.symbol}</span>
            </div>
            <div className='line'>
                <span className='expense-name' title={data.name}>{data.name}</span>
            </div>
            <div className='line'>
                <ColorMarker name={data.category_name} color={data.color} />
                <span className='category-name' title={data.category_name}>{data.category_name}</span>
            </div>
            <div className='line'>
                from: <span className='expense-date' title={startDateStr}>{startDateStr}</span>
                to: <span className='expense-date' title={endDateStr}>{endDateStr}</span>
            </div>
            <div className='line'>
                next execution:
                <span className='expense-date' title={nextDateStr}>{nextDateStr}</span>
            </div>
            <div className='line'>
                <span>{getPatternText(data)}</span>
            </div>

            <div className='line btns'>
                <button className='negative' onClick={onDelete}>Delete</button>
                <button className='positive' onClick={onEdit}>Edit</button>
            </div>
        </VanishingBlock>
    )
}