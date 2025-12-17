import { useCallback, useMemo, useRef, useState } from 'react'
import { useFetchExpenseNamesSuggestion } from '../utils/reactQueryHooks'
import VanishingBlock from './VanishingBlock'

export default function ExpenseNameSuggestion({ searchStr, onChange }) {
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef(null)
    const [nameChanged, setNameChanged] = useState(false)

    const namesSuggestionQuery = useFetchExpenseNamesSuggestion(searchStr, nameChanged)
    const suggestions = useMemo(
        () => namesSuggestionQuery.data || [],
        [namesSuggestionQuery.data]
    )

    const selectSuggestion = useCallback((name) => {
        onChange(name)
        setIsOpen(false)
        setSelectedIndex(-1)
    }, [onChange])

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' && suggestions.length) {
                setIsOpen(true)
                setSelectedIndex(0)
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0)
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1)
                break
            case 'Enter':
                e.preventDefault()
                if (selectedIndex >= 0) {
                    selectSuggestion(suggestions[selectedIndex].name)
                } else if (suggestions.length > 0) {
                    selectSuggestion(suggestions[0].name)
                }
                break
            case 'Escape':
                setIsOpen(false)
                setSelectedIndex(-1)
                break
            default:
                break
        }
    }, [isOpen, selectedIndex, suggestions, selectSuggestion])



    const handleInputChange = (e) => {
        setNameChanged(true)
        onChange(e.target.value)
        setIsOpen(true)
        setSelectedIndex(-1)
    }

    const handleInputFocus = () => {
        if (suggestions.length > 0) {
            setIsOpen(true)
        }
    }

    return (
        <>
            <input name='name'
                className='standart-input'
                aria-label='name of expense'
                value={searchStr}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                placeholder='name'
                ref={inputRef}
                autoFocus
                required
            />
            {isOpen && suggestions.length > 0 &&
                <VanishingBlock
                    anchorRef={inputRef}
                    onClose={() => {
                        setIsOpen(false)
                        setSelectedIndex(-1)
                    }}
                >
                    <ul className='suggestions-list'>
                        {suggestions.map((row, idx) => (
                            <li key={idx}
                                className={`suggestion-item ${idx === selectedIndex ? 'active' : ''}`}
                                onMouseEnter={() => setSelectedIndex(idx)}
                                onClick={() => selectSuggestion(row.name)}
                            >
                                {row.name}
                            </li>
                        ))}
                    </ul>
                </VanishingBlock>
            }
        </>
    )
}