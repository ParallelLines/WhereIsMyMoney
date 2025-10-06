import { useState } from 'react'

export default function Login() {
    const [isLogIn, setIsLogIn] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

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
                <button type="submit">{isLogIn ? "login" : "sign up"}</button>
            </form>
            <div className="auth-options">
                <button
                    onClick={() => setIsLogIn(true)}
                    className={isLogIn ? "auth-option" : "auth-option dull"}
                >Log In</button>
                <button
                    onClick={() => setIsLogIn(false)}
                    className={isLogIn ? "auth-option dull" : "auth-option"}
                >Sign Up</button>
            </div>
        </div>
    )
}