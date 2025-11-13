import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_CATEGORIES = '/categories'

export const getCategories = () => axiosInstance.get(ENDPOINT_CATEGORIES).then(res => res.data)

export const createCategory = (data) => axiosInstance.post(ENDPOINT_CATEGORIES, {
    name: data.name,
    parent_id: data.parent_id,
    color: data.color
})

export const editCategory = (data) => axiosInstance.put(ENDPOINT_CATEGORIES + '/' + data.id, {
    name: data.name,
    parent_id: data.parent_id,
    color: data.color
})

export const deleteCategory = (categoryId) => axiosInstance.delete(ENDPOINT_CATEGORIES + '/' + categoryId)

export const deleteCategories = (categoryIds) => axiosInstance.delete(ENDPOINT_CATEGORIES, {
    data: { ids: categoryIds }
})
