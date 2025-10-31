import React, { useState, useEffect } from 'react';
import { getDashboardSummary, getDashboardTransactions, getAccounts, createTransaction, updateTransaction } from '../services/api';
import MonthSummaryCard from '../components/MonthSummaryCard';
import TransactionChart from '../components/TransactionChart';
import Card from '../components/ui/Card';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import TransactionForm from '../components/TransactionForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [summaryRes, transactionsRes, accountsRes] = await Promise.all([
        getDashboardSummary(),
        getDashboardTransactions(),
        getAccounts(),
      ]);
      
      setMonthlySummary(summaryRes.data);

      const sortedTransactions = transactionsRes.data.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
      
      setAllTransactions(sortedTransactions);
      setRecentTransactions(sortedTransactions.slice(0, 5));
      setAccounts(accountsRes.data);

      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenModal = (transaction = null) => {
    setTransactionToEdit(transaction);
    setTransactionModalOpen(true);
  };

  const handleCloseModal = () => {
    setTransactionToEdit(null);
    setTransactionModalOpen(false);
  };

  const handleSave = async (transactionData) => {
    if (transactionToEdit && transactionToEdit.id) {
      await updateTransaction(transactionToEdit.id, transactionData);
    } else {
      await createTransaction(transactionData);
    }
    handleCloseModal();
    fetchAllData(); // Refetch data to show the new transaction
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
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
            <p className="text-white">No summary data available.</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-white">Inserir Informações</h2>
              <div className="space-y-4">
                <Button variant="success" onClick={() => handleOpenModal({ transactionType: 'ENTRADA' })} className="w-full">⬆️ Nova Entrada</Button>
                <Button variant="danger" onClick={() => handleOpenModal({ transactionType: 'SAIDA' })} className="w-full">⬇ Novo Gasto</Button>
                <Button variant="info" onClick={() => handleOpenModal({ transactionType: 'MOVIMENTACAO' })} className="w-full">↔️ Movimentação</Button>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-9 space-y-8">
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-white">Últimas Transações</h2>
              <div className="space-y-4">
                {recentTransactions.length > 0 ? recentTransactions.map(t => (
                  <div key={t.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-gray-400">{t.category?.name || 'N/A'}</p>
                    </div>
                    <p className={`font-semibold ${t.transactionType === 'SAIDA' ? 'text-red-500' : 'text-green-500'}`}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                    </p>
                  </div>
                )) : <p className="text-gray-400">No recent transactions.</p>}
              </div>
            </Card>
          </div>
          <div className="lg:col-span-9 space-y-8">
            <Card>
              <h2 className="text-2xl font-bold mb-4 text-white">Fluxo de Caixa</h2>
              {allTransactions.length > 0 ? (
                <TransactionChart transactions={allTransactions} />
              ) : (
                <p className="text-gray-400">No transaction data for chart.</p>
              )}
            </Card>
          </div>
          <div className="lg:col-span-3 space-y-10">
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-white">Minhas Contas</h2>
              <div className="space-y-4">
                {accounts.length > 0 ? accounts.map(account => (
                  <div key={account.id} className="flex justify-between items-center">
                    <p className="font-semibold text-white">{account.name}</p>
                    <p className="text-gray-300">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.currentBalance)}</p>
                  </div>
                )) : <p className="text-gray-400">No accounts found.</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Modal isOpen={isTransactionModalOpen} onCancel={handleCloseModal}>
        <TransactionForm
          onSave={handleSave}
          onCancel={handleCloseModal}
          transaction={transactionToEdit}
        />
      </Modal>
    </>
  );
}

export default DashboardPage;