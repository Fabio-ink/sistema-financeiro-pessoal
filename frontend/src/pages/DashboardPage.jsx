import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MonthSummaryCard from '../components/MonthSummaryCard'; // Importamos o novo componente

function DashboardPage() {
  const [Accounts, setAccounts] = useState([]);
  const [RecentTransactions, setRecentTransactions] = useState([]);
  
  // No futuro, estes dados virão da sua API. Por agora, vamos simular.
  const monthlySummaryData = {
    previous: { title: "2025-Setembro", totalSpent: 2672.45, totalIncome: 1428.04, plannedBudget: 2500 },
    current: { title: "2025-Outubro", totalSpent: 1721.28, totalIncome: 33.18, plannedBudget: 1900 },
    next: { title: "2025-Novembro", totalSpent: 0, totalIncome: 0, plannedBudget: 1900 },
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          api.get('/accounts'),
          api.get('/transactions')
        ]);
        
        setAccounts(accountsRes.data);
        setRecentTransactions(transactionsRes.data.slice(0, 5)); 

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // ... O componente StatCard pode ser removido ou mantido, como preferir ...

  return (
    <div className="container mx-auto space-y-8">
      
      {/* NOVA SEÇÃO: Resumo de 3 Meses */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">Visão de 3 meses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthSummaryCard {...monthlySummaryData.previous} />
            <MonthSummaryCard {...monthlySummaryData.current} />
            <MonthSummaryCard {...monthlySummaryData.next} />
        </div>
      </div>
      
      {/* O restante do Dashboard continua aqui... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Transactions</h2>
          {/* ... conteúdo das transações ... */}
        </div>
        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">My Accounts</h2>
          {/* ... conteúdo das contas ... */}
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