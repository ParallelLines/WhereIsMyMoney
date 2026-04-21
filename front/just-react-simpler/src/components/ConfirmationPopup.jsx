import { useState } from 'react'
import VanishingBlock from './VanishingBlock'

export default function ConfirmationPopup({ message, onConfirm, onCancel }) {
    const [open, setOpen] = useState(true)
    const handleConfirm = () => {
        onConfirm()
        setOpen(false)
    }
    return (
        open &&
        <VanishingBlock containerClassName='confirmation-popup-container' background='blur' onClose={onCancel}>
            <div className='line'>
                {message}
            </div>
            <div className='line btns'>
                <button className='negative' onClick={handleConfirm}>Yes</button>
                <button className='positive' onClick={onCancel}>Cancel</button>
            </div>
        </VanishingBlock>
    )
}