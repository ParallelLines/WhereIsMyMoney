import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createExpense, deleteExpense, deleteExpenses, editExpense, getExpenses } from '../apiService/expenses'
import { createRegular, deleteRegular, deleteRegulars, editRegular, getNextDate, getRegulars } from '../apiService/regulars'
import { useErrorQueue, useMonthOffset, useSelectedCategory, useSelectedRegular } from '../utils/AppContext'
import { createCategory, deleteCategories, deleteCategory, editCategory, getCategories } from '../apiService/categories'
import { getCurrencies } from '../apiService/currencies'
import { useEffect, useRef } from 'react'
import { getCategoriesSuggestion, getExpenseNamesSuggestion } from '../apiService/suggestions'
import { getPieStats } from '../apiService/stats'
import { getMonthYearByOffset } from './date'

export const useFetchPieStats = () => {
    return useQuery({
        queryKey: ['pie'],
        queryFn: () => getPieStats(),
        retry: retryAfterError,
        staleTime: Infinity
    })
}

export const useFetchCategoriesSuggestion = (expenseName) => {
    const lastNonEmptyRef = useRef(null)
    return useQuery({
        queryKey: ['categories_suggestion', expenseName],
        queryFn: () => getCategoriesSuggestion(expenseName),
        enabled: expenseName ? expenseName.trim().length > 0 : false,
        select: (data) => {
            if (Array.isArray(data) && data.length > 0) {
                lastNonEmptyRef.current = data
                return data
            }
            return lastNonEmptyRef.current ?? data
        },
        retry: retryAfterError
    })
}

export const useFetchExpenseNamesSuggestion = (expenseName, isEnabled = true) => {
    return useQuery({
        queryKey: ['expense_names_suggestion', expenseName],
        queryFn: () => getExpenseNamesSuggestion(expenseName),
        enabled: expenseName && isEnabled ? expenseName.trim().length > 0 : false,
        retry: retryAfterError
    })
}

export const useFetchExpenses = () => {
    const { selectedCategory } = useSelectedCategory()
    const { selectedRegular } = useSelectedRegular()
    const { monthOffset } = useMonthOffset()
    const monthYear = getMonthYearByOffset(monthOffset)
    const params = {
        selectedCategory,
        selectedRegular,
        month: monthYear.month,
        year: monthYear.year
    }
    console.log()
    return useInfiniteQuery({
        queryKey: ['expenses', selectedCategory, selectedRegular, monthOffset],
        queryFn: ({ pageParam = 0 }) =>
            getExpenses({ pageParam, ...params }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },
        staleTime: Infinity,
        retry: retryAfterError
    })
}

export const usePrefetchExpenses = async () => {
    const queryClient = useQueryClient()
    const { selectedCategory } = useSelectedCategory()
    const { selectedRegular } = useSelectedRegular()
    const { monthOffset } = useMonthOffset()
    const monthYear = getMonthYearByOffset(monthOffset)
    const params = {
        selectedCategory,
        selectedRegular,
        month: monthYear.month,
        year: monthYear.year
    }
    await queryClient.prefetchInfiniteQuery({
        queryKey: ['expenses', selectedCategory, selectedRegular, monthOffset],
        queryFn: ({ pageParam = 0 }) =>
            getExpenses({ pageParam, ...params }),
        pages: 5,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },
        staleTime: Infinity,
        retry: retryAfterError
    })
}

export const useCreateExpense = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createExpense,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['currencies'] })
            await queryClient.invalidateQueries({ queryKey: ['pie'] })
        }
    })
}

export const useEditExpense = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: editExpense,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['currencies'] })
            await queryClient.invalidateQueries({ queryKey: ['pie'] })
        }
    })
}

export const useDeleteExpense = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteExpense,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['pie'] })
        }
    })
}

export const useDeleteExpenses = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteExpenses,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['pie'] })
        }
    })
}

export const useFetchRegulars = () => {
    const { selectedCategory } = useSelectedCategory()
    return useQuery({
        queryKey: ['regulars', selectedCategory],
        queryFn: () => getRegulars(selectedCategory),
        retry: retryAfterError
    })
}

export const useFetchNextDate = (pattern) => {
    return useQuery({
        queryKey: ['nextDate', pattern],
        queryFn: () => getNextDate(pattern),
        retry: retryAfterError
    })
}

export const useCreateRegular = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createRegular,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['regulars'] })
    })
}

export const useEditRegular = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: editRegular,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['regulars'] })
    })
}

export const useDeleteRegular = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteRegular,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['regulars'] })
    })
}

export const useDeleteRegulars = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteRegulars,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['regulars'] })
    })
}

export const useFetchCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: Infinity,
        retry: retryAfterError
    })
}

export const useCreateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCategory,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    })
}

export const useEditCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: editCategory,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    })
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteCategory,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    })
}

export const useDeleteCategories = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteCategories,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    })
}

export const useFetchCurrencies = () => {
    return useQuery({
        queryKey: ['currencies'],
        queryFn: getCurrencies,
        staleTime: Infinity,
        retry: retryAfterError
    })
}

export function useMonitorErrors(query, onCancel) {
    const { addError } = useErrorQueue()
    useEffect(() => {
        if (query.isError) {
            const message = query.error.response && query.error.response.data ? query.error.response.data : query.error.message
            addError(`Unexpected error: ${message}`)
            if (onCancel) onCancel()
        }
    }, [query.isError, query.error, addError, onCancel])
}

function retryAfterError(failureCount, error) {
    if (error.response && error.response.status === 400) {
        return false // don't retry on 400
    }
    return failureCount < 3 // otherwise, normal retry logic
}

