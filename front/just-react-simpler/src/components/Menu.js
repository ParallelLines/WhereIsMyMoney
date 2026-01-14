import { useRef, useState } from 'react'
import IconMenu from './icons/IconMenu'
import { useCookies } from 'react-cookie'
import VanishingBlock from './VanishingBlock'

const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME

export default function Menu({ menuItems, onSelect, selectedItem }) {
    const [open, setOpen] = useState(false)
    const [, , removeCookie] = useCookies(null)
    const buttonRef = useRef(null)
    return (
        <div className='menu-container'>
            <button className='menu icon-btn' onClick={() => setOpen(!open)} ref={buttonRef}>
                <IconMenu />
            </button>
            {open &&
                <VanishingBlock
                    anchorRef={buttonRef}
                    popoverWidth={300} //(15rem + 2rem padding) * 15px
                    onClose={() => setOpen(false)}
                >
                    <div className='menu-list-container'>
                        <ul className='menu-list'>
                            {menuItems.map((item, id) => (
                                <li className={`menu-list-item ${item.name === selectedItem ? ' disabled' : ''}`}
                                    onClick={() => {
                                        onSelect(item.name)
                                        setOpen(false)
                                    }}
                                    key={id}
                                >
                                    {item.text}
                                </li>
                            ))}
                            <li className='menu-list-item' onClick={() => removeCookie(COOKIE_AUTH_NAME)}>
                                Log Out
                            </li>
                        </ul>
                    </div>
                </VanishingBlock>}
        </div>
    )
}