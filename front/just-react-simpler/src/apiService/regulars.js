import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_REGULARS = '/regulars'

export const getRegulars = () => axiosInstance.get(ENDPOINT_REGULARS).then(res => res.data)
