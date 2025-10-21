import axiosInstance from '../utils/axiosInstance'

const ENDPOINT_EXPENSES = '/expenses'
const ELEMENTS_PER_PAGE = 10

export const getExpenses = ({ pageParam }) => axiosInstance.get(ENDPOINT_EXPENSES + `?page=${pageParam}&elementsPerPage=${ELEMENTS_PER_PAGE}`).then(res => res.data)

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
