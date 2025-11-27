import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_REGULARS = '/regulars'

export const getRegulars = (selectedCategory) => axiosInstance.get(ENDPOINT_REGULARS + '?category=' + selectedCategory).then(res => res.data)

export const createRegular = (data) => axiosInstance.post(ENDPOINT_REGULARS, {
    name: data.name,
    sum: data.sum,
    currency: data.currency,
    category_id: data.category_id,
    start_date: data.start_date,
    end_date: data.end_date,
    repeat_interval: data.repeat_interval,
    repeat_every: data.repeat_every,
    repeat_each_weekday: data.repeat_each_weekday,
    repeat_each_day_of_month: data.repeat_each_day_of_month,
    repeat_each_month: data.repeat_each_month,
    repeat_on_day_num: data.repeat_on_day_num,
    repeat_on_weekday: data.repeat_on_weekday
})

export const editRegular = (data) => axiosInstance.put(ENDPOINT_REGULARS + '/' + data.id, {
    name: data.name,
    sum: data.sum,
    currency: data.currency,
    category_id: data.category_id,
    start_date: data.start_date,
    end_date: data.end_date,
    repeat_interval: data.repeat_interval,
    repeat_every: data.repeat_every,
    repeat_each_weekday: data.repeat_each_weekday,
    repeat_each_day_of_month: data.repeat_each_day_of_month,
    repeat_each_month: data.repeat_each_month,
    repeat_on_day_num: data.repeat_on_day_num,
    repeat_on_weekday: data.repeat_on_weekday
})

export const getNextDate = (data) => axiosInstance.post(ENDPOINT_REGULARS + '/nextDate', data)

export const deleteRegular = (regularId) => axiosInstance.delete(ENDPOINT_REGULARS + '/' + regularId)

export const deleteRegulars = (regularId) => axiosInstance.delete(ENDPOINT_REGULARS, {
    data: { ids: regularId }
}) 