import { useState } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME

export default function Login() {
    const [cookie, setCookie, removeCookie] = useCookies(null)
    const [isLogIn, setIsLogIn] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)

    const viewLogIn = (status) => {
        setError(null)
        setIsLogIn(status)
    }

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault()
        if (!isLogIn && password !== confirmPassword) {
            setError('Passwords don\'t match :(')
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
        await axios
            .post(url, reqBody, params)
            .then(res => {
                setCookie(COOKIE_AUTH_NAME, res.data)
                window.location.reload() // do i need this??
            })
            .catch(e => {
                if (e.response) {
                    setError(e.response.data)
                } else
                    console.log(e)
            })
    }

    return (
        <div className="auth">
            <form className="auth-form">
                <input
                    className="auth-form-input"
                    name="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="auth-form-input"
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isLogIn &&
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />}
                <button type="submit"
                    onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')}>
                    {isLogIn ? "login" : "sign up"}
                </button>
                {error && <div className="input-error">{error}</div>}
            </form>
            <div className="auth-options">
                <button
                    onClick={() => viewLogIn(true)}
                    className={isLogIn ? "auth-option" : "auth-option dull"}
                >Log In</button>
                <button
                    onClick={() => viewLogIn(false)}
                    className={isLogIn ? "auth-option dull" : "auth-option"}
                >Sign Up</button>
            </div>
        </div>
    )
}