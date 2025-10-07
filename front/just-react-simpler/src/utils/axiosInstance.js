import axios from 'axios'
import { Cookies } from 'react-cookie'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const COOKIE_AUTH_NAME = process.env.REACT_APP_COOKIE_AUTH_NAME
const cookies = new Cookies()

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = cookies.get(COOKIE_AUTH_NAME)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            cookies.remove(COOKIE_AUTH_NAME)
            window.location.reload() // do i need this??
        }
        return Promise.reject(error)
    }
)

export default axiosInstance