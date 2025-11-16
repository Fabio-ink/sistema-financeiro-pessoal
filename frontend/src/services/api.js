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

export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getDashboardTransactions = () => api.get('/dashboard/transactions'); // Você pode trocar isso por useCrud('/transactions') no dashboard se preferir

export const createTransaction = (transactionData) => api.post('/transactions', transactionData);
export const updateTransaction = (id, transactionData) => api.put(`/transactions/${id}`, transactionData);

export default api;