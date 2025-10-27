import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MonthSummaryCard from '../components/MonthSummaryCard'; // Importamos o novo componente

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, transactionsRes, summaryRes] = await Promise.all([
          api.get('/accounts'),
          api.get('/transactions'),
          api.get('/dashboard/summary')
        ]);
        
        setAccounts(accountsRes.data);
        setRecentTransactions(transactionsRes.data.slice(0, 5)); 
        setMonthlySummary(summaryRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto space-y-8">
      
      {/* NOVA SEÇÃO: Resumo de 3 Meses */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Visão de 3 meses</h2>
        {monthlySummary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthSummaryCard {...monthlySummary.previous} />
            <MonthSummaryCard {...monthlySummary.current} />
            <MonthSummaryCard {...monthlySummary.next} />
          </div>
        ) : (
          <p className="text-white">Loading summaries...</p>
        )}
      </div>
      
      {/* O restante do Dashboard continua aqui... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h2>
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
          <h2 className="text-xl font-semibold mb-4 text-white">My Accounts</h2>
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

       {/* Futura Seção de Gráficos */}
       <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Fluxo de transações em cada mês</h2>
          <p className="text-gray-400">(O componente do gráfico de Donut ficará aqui)</p>
        </div>
    </div>
  );
}

export default DashboardPage;