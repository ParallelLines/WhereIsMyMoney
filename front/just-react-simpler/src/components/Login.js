import { useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { useErrorQueue } from '../utils/AppContext'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME
const ALLOW_SIGNUP = process.env.REACT_APP_ALLOW_SIGNUP === 'true'

export default function Login() {
    const [, setCookie] = useCookies()
    const [isLogIn, setIsLogIn] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { addError } = useErrorQueue()

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault()
        if (!isLogIn && password !== confirmPassword) {
            addError('Passwords don\'t match :(')
            return
        }
        const url = `${BACKEND_URL}/${endpoint}`
        const reqBody = {
            username: username,
            password: password
        }
        const params = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const expires = new Date()
        expires.setDate(expires.getDate() + 100)
        await axios
            .post(url, reqBody, params)
            .then(res => {
                setCookie(COOKIE_AUTH_NAME, res.data, { expires })
                window.location.reload() // do i need this??
            })
            .catch(e => {
                if (e.response) {
                    addError(e.response.statusText)
                } else
                    console.log(e)
            })
    }

    return (
        <div className='auth'>
            <div className='auth-options'>
                <button
                    onClick={() => setIsLogIn(true)}
                    className={`auth-option ${!isLogIn && 'dull'}`}
                >Log In</button>
                <button
                    onClick={() => setIsLogIn(false)}
                    className={`auth-option ${isLogIn && 'dull'}`}
                    disabled={!ALLOW_SIGNUP}
                >Sign Up</button>
            </div>
            <form className='auth-form'>
                <input
                    className='auth-form-input'
                    name='username'
                    placeholder='username'
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className='auth-form-input'
                    name='password'
                    type='password'
                    placeholder='password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isLogIn &&
                    <input
                        className='auth-form-input'
                        type='password'
                        placeholder='confirm password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />}
                <button type='submit'
                    onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}>
                    {isLogIn ? 'Enter' : 'Create'}
                </button>
            </form>
        </div>
    )
}