import { dateTimeString } from '../utils/date'
import VanishingBlock from './VanishingBlock'
import ColorMarker from './ColorMarker'

export default function RegularExpenseView({ data, onClose, onEdit, onDelete }) {
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
                <span className='expense-date' title={dateTimeString(data.date)}>{dateTimeString(data.date)}</span>
            </div>

            <div className='line btns'>
                <button className='negative' onClick={onDelete}>Delete</button>
                <button className='positive' onClick={onEdit}>Edit</button>
            </div>
        </VanishingBlock>
    )
}