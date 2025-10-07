import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_CURRENCIES = '/currencies'

export const getCurrencies = () => axiosInstance.get(ENDPOINT_CURRENCIES).then(res => res.data)