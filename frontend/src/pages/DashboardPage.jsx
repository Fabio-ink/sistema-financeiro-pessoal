import React, { useState, useEffect } from 'react';
import { getDashboardSummary, getDashboardTransactions } from '../services/api';
import MonthSummaryCard from '../components/MonthSummaryCard';
import TransactionChart from '../components/TransactionChart';

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          getDashboardSummary(),
          getDashboardTransactions(),
        ]);
        
        setMonthlySummary(summaryRes.data);

        // Ordena as transações por data, da mais recente para a mais antiga
        const sortedTransactions = transactionsRes.data.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
        
        setAllTransactions(sortedTransactions);
        setRecentTransactions(sortedTransactions.slice(0, 5));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Visão Geral dos 3 Meses</h2>
        {monthlySummary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthSummaryCard {...monthlySummary.previous} />
            <MonthSummaryCard {...monthlySummary.current} />
            <MonthSummaryCard {...monthlySummary.next} />
          </div>
        ) : (
          <p className="text-white">Carregando resumos...</p>
        )}
      </div>
      
      {/* Gráfico de Fluxo de Transações */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-white">Fluxo de Caixa</h2>
          {allTransactions.length > 0 ? (
            <TransactionChart transactions={allTransactions} />
          ) : (
            <p className="text-gray-400">Carregando gráfico...</p>
          )}
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Últimas Transações</h2>
          <div className="space-y-4">
            {recentTransactions.map(t => (
              <div key={t.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.category?.name || 'N/A'}</p>
                </div>
                <p className={`font-semibold ${t.transactionType === 'SAIDA' ? 'text-red-500' : 'text-green-500'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Minhas Contas</h2>
          <div className="space-y-4">
            {accounts.map(account => (
              <div key={account.id} className="flex justify-between items-center">
                <p className="font-semibold text-white">{account.name}</p>
                <p className="text-gray-300">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.initialBalance)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;