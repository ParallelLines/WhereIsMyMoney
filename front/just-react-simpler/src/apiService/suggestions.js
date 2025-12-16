import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_CATEGORIES = '/suggestions'

export const getCategoriesSuggestion = (expenseName) => axiosInstance.get(ENDPOINT_CATEGORIES + '/category/' + expenseName).then(res => res.data)

export const getExpenseNamesSuggestion = (expenseName) => axiosInstance.get(ENDPOINT_CATEGORIES + '/expense/' + expenseName).then(res => res.data)
