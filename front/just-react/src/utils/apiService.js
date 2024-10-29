import axiosInstance from './axiosInstance'

const ENDPOINT_CATEGORIES = '/categories'
export const getCategories = () => axiosInstance.get(ENDPOINT_CATEGORIES)
export const createCategory = (data) => axiosInstance.post(ENDPOINT_CATEGORIES, data)
export const editCategory = (categoryId, data) => axiosInstance.put(ENDPOINT_CATEGORIES + '/' + categoryId, data)
export const deleteCategory = (categoryId) => axiosInstance.delete(ENDPOINT_CATEGORIES + '/' + categoryId)