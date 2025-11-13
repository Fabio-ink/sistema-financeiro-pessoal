import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getDashboardTransactions = () => api.get('/dashboard/transactions');

// Accounts
export const getAccounts = () => api.get('/accounts');
export const createAccount = (accountData) => api.post('/accounts', accountData);
export const updateAccount = (id, accountData) => api.put(`/accounts/${id}`, accountData);
export const deleteAccount = (id) => api.delete(`/accounts/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (categoryData) => api.post('/categories', categoryData);
export const updateCategory = (id, categoryData) => api.put(`/categories/${id}`, categoryData);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Transactions
export const getTransactions = () => api.get('/transactions');
export const createTransaction = (transactionData) => api.post('/transactions', transactionData);
export const updateTransaction = (id, transactionData) => api.put(`/transactions/${id}`, transactionData);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export default api;