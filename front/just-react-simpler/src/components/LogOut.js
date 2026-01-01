import { useCookies } from 'react-cookie'
import IconCancel from './icons/IconCancel'

const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME

export default function LogOut() {
    const [, , removeCookie] = useCookies(null)
    return (
        <button
            className='logout icon-btn'
            onClick={() => removeCookie(COOKIE_AUTH_NAME)}
        >
            <IconCancel />
        </button>
    )
}