import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_CATEGORIES = '/stats'

export const getPieStats = () => axiosInstance.get(ENDPOINT_CATEGORIES + '/pie').then(res => res.data)