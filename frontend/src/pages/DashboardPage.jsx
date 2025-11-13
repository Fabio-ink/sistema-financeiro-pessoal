import React, { useState, useEffect, useCallback } from 'react';
import { getDashboardSummary, getDashboardTransactions, createTransaction, updateTransaction } from '../services/api';
import MonthSummaryCard from '../components/MonthSummaryCard';
import TransactionChart from '../components/TransactionChart';
import Card from '../components/ui/Card';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import TransactionForm from '../components/TransactionForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useCrud } from '../hooks/useCrud';
import PageTitle from '../components/ui/PageTitle';

function DashboardPage() {
  const { items: accounts, loading: accountsLoading, error: accountsError, fetchItems: fetchAccounts } = useCrud('/accounts');
  const { items: categories, loading: categoriesLoading, error: categoriesError, fetchItems: fetchCategories } = useCrud('/categories');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, transactionsRes] = await Promise.all([
        getDashboardSummary(),
        getDashboardTransactions(),
      ]);
      
      setMonthlySummary(summaryRes.data);

      const sortedTransactions = transactionsRes.data.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
      
      setAllTransactions(sortedTransactions);
      setRecentTransactions(sortedTransactions.slice(0, 5));

      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    fetchAccounts();
    fetchCategories();
  }, [fetchAllData, fetchAccounts, fetchCategories]);

  console.log("DashboardPage - loading:", loading, "accountsLoading:", accountsLoading);
  console.log("DashboardPage - error:", error, "accountsError:", accountsError);
  console.log("DashboardPage - monthlySummary:", monthlySummary);
  console.log("DashboardPage - recentTransactions:", recentTransactions.length);
  console.log("DashboardPage - accounts:", accounts.length);

  const handleOpenModal = useCallback((transaction = null) => {
    setTransactionToEdit(transaction);
    setTransactionModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setTransactionToEdit(null);
    setTransactionModalOpen(false);
  }, []);

  const handleSave = useCallback(async (transactionData) => {
    if (transactionToEdit && transactionToEdit.id) {
      await updateTransaction(transactionToEdit.id, transactionData);
    } else {
      await createTransaction(transactionData);
    }
    handleCloseModal();
    fetchAllData(); // Refetch data to show the new transaction
  }, [transactionToEdit, handleCloseModal, fetchAllData]);

  if (loading || accountsLoading || categoriesLoading) {
    return <Spinner />;
  }

  if (error || accountsError || categoriesError) {
    return <ErrorMessage message={error || accountsError || categoriesError} />;
  }

  return (
    <>
      <div className="container mx-auto space-y-8">
        <div>
          <PageTitle level={2} className="mb-4">Visão Geral dos 3 Meses</PageTitle>
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
              <PageTitle level={2} className="text-xl font-semibold mb-4">Inserir Informações</PageTitle>
              <div className="space-y-4">
                <Button variant="success" onClick={() => handleOpenModal({ transactionType: 'ENTRADA' })} className="w-full">⬆️ Nova Entrada</Button>
                <Button variant="danger" onClick={() => handleOpenModal({ transactionType: 'SAIDA' })} className="w-full">⬇ Novo Gasto</Button>
                <Button variant="info" onClick={() => handleOpenModal({ transactionType: 'MOVIMENTACAO' })} className="w-full">↔️ Movimentação</Button>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-9 space-y-8">
            <Card>
              <PageTitle level={2} className="text-xl font-semibold mb-4">Últimas Transações</PageTitle>
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
              <PageTitle level={2} className="text-2xl font-bold mb-4">Fluxo de Caixa</PageTitle>
              {allTransactions.length > 0 ? (
                <TransactionChart transactions={allTransactions} />
              ) : (
                <p className="text-gray-400">No transaction data for chart.</p>
              )}
            </Card>
          </div>
          <div className="lg:col-span-3 space-y-10">
            <Card>
              <PageTitle level={2} className="text-xl font-semibold mb-4">Minhas Contas</PageTitle>
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
          accounts={accounts}
          categories={categories}
        />
      </Modal>
    </>
  );
}

export default DashboardPage;