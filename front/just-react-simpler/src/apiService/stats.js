import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_STATS = '/stats'

export const getPieStats = () => axiosInstance.get(ENDPOINT_STATS + '/pie').then(res => res.data)

export const getNextMonthRegularSums = () => axiosInstance.get(ENDPOINT_STATS + '/nextMonthRegulars').then(res => res.data)