import { useState } from 'react'

export default function ButtonsGrid({ width, values, defaultSelected, onSelect, disabled }) {
    const [selectedButtons, setSelectedButtons] = useState(prepareDefaultSet(defaultSelected))

    const valuesGrid = Array.from(
        Array(Math.ceil(values.length / width)),
        (_, rowIndex) => values.slice(rowIndex * width, rowIndex * width + width)
    )

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
        <div className={`calendar ${disabled ? 'disabled' : ''}`} >
            {valuesGrid.map(row =>
                <div className='line'>
                    {row.map(value =>
                        <button
                            name={value}
                            key={value}
                            aria-pressed={selectedButtons.has(value)}
                            onClick={handleClick}
                            disabled={disabled}
                        >
                            {value}
                        </button>)
                    }
                </div>
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