import { useState, useCallback } from 'react';

export const useTransactionFilters = () => {
    const [filters, setFilters] = useState({
        name: '',
        startDate: '',
        endDate: '',
        categoryId: '',
        transactionType: ''
    });

    const handleChange = useCallback((field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            name: '',
            startDate: '',
            endDate: '',
            categoryId: '',
            transactionType: ''
        });
    }, []);

    const getFilterParams = useCallback(() => {
        const params = {};
        if (filters.name) params.name = filters.name;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.transactionType) params.transactionType = filters.transactionType;
        return params;
    }, [filters]);

    return {
        filters,
        handleChange,
        clearFilters,
        getFilterParams
    };
};
