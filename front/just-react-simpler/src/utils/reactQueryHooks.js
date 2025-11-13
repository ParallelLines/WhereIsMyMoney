import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createExpense, deleteExpense, deleteExpenses, editExpense, getExpenses } from '../apiService/expenses'
import { createRegular, deleteRegular, deleteRegulars, editRegular, getRegulars } from '../apiService/regulars'
import { useSelectedCategory } from '../utils/AppContext'
import { getCategories } from '../apiService/categories'
import { getCurrencies } from '../apiService/currencies'

export const useFetchExpenses = () => {
    const { selectedCategory } = useSelectedCategory()
    return useInfiniteQuery({
        queryKey: ['expenses', selectedCategory],
        queryFn: ({ pageParam = 0 }) =>
            getExpenses({ pageParam, selectedCategory }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },
        staleTime: Infinity
    })
}

export const usePrefetchExpenses = async () => {
    const queryClient = useQueryClient()
    const { selectedCategory } = useSelectedCategory()
    await queryClient.prefetchInfiniteQuery({
        queryKey: ['expenses', selectedCategory],
        queryFn: ({ pageParam = 0 }) =>
            getExpenses({ pageParam, selectedCategory }),
        pages: 5,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.length === 0) {
                return undefined
            }
            return lastPageParam + 1
        },
        staleTime: Infinity
    })
}

export const useCreateExpense = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createExpense,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['currencies'] })
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
        }
    })
}

export const useDeleteExpense = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteExpense,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] })
    })
}

export const useDeleteExpenses = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteExpenses,
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['expenses'] })
    })
}

export const useFetchRegulars = () => {
    return useQuery({ queryKey: ['regulars'], queryFn: getRegulars })
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
    return useQuery({ queryKey: ['categories'], queryFn: getCategories, staleTime: Infinity })
}

export const useFetchCurrencies = () => {
    return useQuery({ queryKey: ['currencies'], queryFn: getCurrencies, staleTime: Infinity })
}

