import axiosInstance from './axiosInstance'

const ENDPOINT_CATEGORIES = '/categories'
export const getCategories = () => axiosInstance.get(ENDPOINT_CATEGORIES)
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

const ENDPOINT_EXPENSES = '/expenses'
export const getExpenses = () => axiosInstance.get(ENDPOINT_EXPENSES)
export const getExpensesNamesByPrefix = (prefix) => axiosInstance.get(ENDPOINT_EXPENSES + '/names/' + prefix)
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

const ENDPOINT_CURRENCIES = '/currencies'
export const getCurrencies = () => axiosInstance.get(ENDPOINT_CURRENCIES)