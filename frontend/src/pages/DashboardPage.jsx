import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MonthSummaryCard from '../components/MonthSummaryCard';

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stats, setStats] = useState({ totalIncomes: 0, totalExpenses: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca todas as requisições em paralelo para otimizar
        const [accountsRes, transactionsRes] = await Promise.all([
          api.get('/accounts'),
          api.get('/transactions')
        ]);
        
        setAccounts(accountsRes.data);
        // Pega as 5 transações mais recentes
        setRecentTransactions(transactionsRes.data.slice(0, 5)); 

        // Calcula estatísticas simples (exemplo)
        let totalIncomes = 0;
        let totalExpenses = 0;
        transactionsRes.data.forEach(t => {
          if (t.transactionType === 'ENTRADA') totalIncomes += t.amount;
          if (t.transactionType === 'SAIDA') totalExpenses += t.amount;
        });
        setStats({ totalIncomes, totalExpenses });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Financial Dashboard</h1>

      {/* Seção de Resumo Rápido */}
      <MonthSummaryCard stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Transações Recentes */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map(t => (
              <div key={t.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{t.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.category?.name || 'No Category'}</p>
                </div>
                <p className={`font-bold ${t.transactionType === 'SAIDA' ? 'text-red-600' : 'text-green-600'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna da Direita: Contas */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">My Accounts</h2>
          <div className="space-y-4">
            {accounts.map(acc => (
              <div key={acc.id} className="flex justify-between items-center">
                <p className="font-medium text-gray-900 dark:text-gray-100">{acc.name}</p>
                <p className="text-gray-800 dark:text-gray-200">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.currentBalance)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;