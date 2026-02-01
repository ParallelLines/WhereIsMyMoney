import { useCookies } from 'react-cookie'
import IconLogOut from './icons/IconLogOut'

const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME

export default function LogOut() {
    const [, , removeCookie] = useCookies(null)
    return (
        <button
            className='logout icon-btn'
            onClick={() => removeCookie(COOKIE_AUTH_NAME)}
        >
            <IconLogOut />
        </button>
    )
}