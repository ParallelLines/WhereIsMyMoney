import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_REGULARS = '/regulars'

export const getRegulars = () => axiosInstance.get(ENDPOINT_REGULARS).then(res => res.data)

export const createRegular = (data) => axiosInstance.post(ENDPOINT_REGULARS, {
    name: data.name,
    sum: data.sum,
    currency: data.currency,
    category_id: data.category_id,
    date: data.date
})

export const editRegular = (data) => axiosInstance.put(ENDPOINT_REGULARS + '/' + data.id, {
    name: data.name,
    sum: data.sum,
    currency: data.currency,
    category_id: data.category_id,
    date: data.date
})

export const deleteRegular = (regularId) => axiosInstance.delete(ENDPOINT_REGULARS + '/' + regularId)

export const deleteRegulars = (regularId) => axiosInstance.delete(ENDPOINT_REGULARS, {
    data: { ids: regularId }
}) 