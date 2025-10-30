import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Função para buscar o resumo do dashboard
export const getDashboardSummary = () => API.get('/dashboard/summary');

// Função para buscar todas as transações para o gráfico
export const getDashboardTransactions = () => API.get('/dashboard/transactions');


export default API;