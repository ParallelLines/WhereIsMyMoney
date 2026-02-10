import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_EXPENSES = '/expenses'
const ELEMENTS_PER_PAGE = 10

export const getExpenses = ({ pageParam, selectedCategory, selectedRegular, day, month, year }) => {
    let params = ''
    params += pageParam ? `page=${pageParam}` : ''
    params += ELEMENTS_PER_PAGE ? `&elementsPerPage=${ELEMENTS_PER_PAGE}` : ''
    params += selectedCategory ? `&category=${selectedCategory}` : ''
    params += selectedRegular ? `&regular=${selectedRegular}` : ''
    params += day ? `&day=${day}` : ''
    params += month !== null && month !== undefined ? `&month=${month}` : ''
    params += year ? `&year=${year}` : ''
    return axiosInstance.get(ENDPOINT_EXPENSES + '?' + params).then(res => res.data)
}

export const getExpensesNamesByPrefix = (prefix) => axiosInstance.get(ENDPOINT_EXPENSES + '/names/' + prefix).then(res => res.data)

export const createExpense = (data) => axiosInstance.post(ENDPOINT_EXPENSES, {
    name: data.name,
    sum: data.sum,
    currency: data.currency,
    category_id: data.category_id,
    date: data.date
})

export const editExpense = (data) => axiosInstance.put(ENDPOINT_EXPENSES + '/' + data.id, {
    name: data.name,
    sum: data.sum,
    currency: data.currency,
    category_id: data.category_id,
    date: data.date
})

export const deleteExpense = (expenseId) => axiosInstance.delete(ENDPOINT_EXPENSES + '/' + expenseId)

export const deleteExpenses = (expenseIds) => axiosInstance.delete(ENDPOINT_EXPENSES, {
    data: { ids: expenseIds }
})
