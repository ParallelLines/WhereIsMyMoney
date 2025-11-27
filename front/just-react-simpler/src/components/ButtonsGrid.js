import { useState } from 'react'

export default function ButtonsGrid({ width, values, defaultSelected, onSelect, disabled }) {
    const [selectedButtons, setSelectedButtons] = useState(prepareDefaultSet(defaultSelected))
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
        if (selectedButtons.has(value)) {
            if (selectedButtons.size === 1) return
            selectedButtons.delete(value)
        } else {
            selectedButtons.add(value)
        }
        setSelectedButtons(selectedButtons)
        onSelect(Array.from(selectedButtons))
    }

    return (
        <div className={`calendar ${disabled ? 'disabled' : ''}`} style={gridStyle}>
            {values.map(value =>
                <button
                    name={value}
                    key={value}
                    aria-pressed={selectedButtons.has(value)}
                    onClick={handleClick}
                    style={buttonStyle}
                    disabled={disabled}
                >
                    {value}
                </button>
            )}
        </div>
    )
}

function prepareDefaultSet(defaultValues) {
    if (!defaultValues || defaultValues.length === 0) return new Set()
    if (defaultValues instanceof Set) return defaultValues
    if (typeof defaultValues === 'string') return parseSet(defaultValues)
    const stringArr = defaultValues.map(val => val.toString())
    return new Set(stringArr)
}

/**
 * 
 * @param {String} str a string like "{Tue,Sat,Fri,Sat}"
 * @returns {Set} a Set of strings like ['Tue', 'Sat', 'Fri']
 */
function parseSet(str) {
    const clearedStr = str.replace('{', '').replace('}', '')
    if (clearedStr.length === 0) return new Set()
    const arr = clearedStr.split(',')
    return new Set(arr)
}