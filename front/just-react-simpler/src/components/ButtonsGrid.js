import { useState } from 'react'

export default function ButtonsGrid({ width, values, defaultSelected, onSelect }) {
    const [selectedButtons, setSelectedButtons] = useState(defaultSelected ? [defaultSelected] : [])
    const buttonWidth = 2
    const gridWidth = buttonWidth * width
    const gridStyle = {
        minWidth: gridWidth + 'rem',
        width: gridWidth + 'rem',
        maxWidth: gridWidth + 'rem',
    }

    const buttonStyle = {
        width: buttonWidth + 'rem',
        height: buttonWidth + 'rem'
    }

    const handleClick = (e) => {
        e.preventDefault()
        const value = e.target.name
        const index = selectedButtons.indexOf(value)
        if (index >= 0) {
            if (selectedButtons.length === 1) return
            setSelectedButtons(selectedButtons.toSpliced(index, 1))
        } else {
            setSelectedButtons([...selectedButtons, value])
        }
        onSelect(selectedButtons)
    }

    return (
        <div className='calendar' style={gridStyle}>
            {values.map(value =>
                <button
                    name={value}
                    key={value}
                    aria-pressed={selectedButtons.indexOf(value) >= 0 ? true : false}
                    onClick={handleClick}
                    style={buttonStyle}
                >
                    {value}
                </button>
            )}
        </div>
    )
}