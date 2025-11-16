import React, { useState, useEffect, useCallback } from 'react';
import { createTransaction, updateTransaction } from '../services/api'; 
import MonthSummaryCard from '../components/MonthSummaryCard';
import TransactionChart from '../components/TransactionChart';
import Card from '../components/ui/Card';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import TransactionForm from '../components/TransactionForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PageTitle from '../components/ui/PageTitle';
import { ArrowUp, ArrowDown, ArrowRightLeft } from 'lucide-react';
import { PlusCircle } from 'lucide-react'; 
import api from '../services/api';

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  // Hook para buscar todos os dados do dashboard
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, transRes, accountsRes, categoriesRes] = await Promise.all([
        api.get('/dashboard/summary'), 
        api.get('/transactions'),     
        api.get('/accounts'),         
        api.get('/categories')        
      ]);
      
      setMonthlySummary(summaryRes.data);
      setAllTransactions(transRes.data);
      setAccounts(accountsRes.data);
      setCategories(categoriesRes.data);

      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleOpenModal = useCallback((type = 'SAIDA') => {
    setTransactionToEdit({ transactionType: type });
    setTransactionModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setTransactionToEdit(null);
    setTransactionModalOpen(false);
  }, []);

  const handleSave = useCallback(async (transactionData) => {
    try {
      if (transactionToEdit && transactionToEdit.id) {
        await updateTransaction(transactionToEdit.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }
      handleCloseModal();
      fetchAllData(); 
    } catch (error) {
      console.error("Error saving transaction", error);
    }
  }, [transactionToEdit, handleCloseModal, fetchAllData]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <div className="container mx-auto space-y-6">
        
        {/* Resumo dos 3 Meses */}
        {monthlySummary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthSummaryCard title="October" {...monthlySummary.previous} />
            <MonthSummaryCard title="November" {...monthlySummary.current} />
            <MonthSummaryCard title="December" {...monthlySummary.next} />
          </div>
        ) : (
          <p className="text-gray-400">Loading monthly summaries...</p>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda (Gráfico) */}
          <div className="lg:col-span-2">
            <Card className="p-4 h-full">
              <PageTitle level={2} className="text-xl font-semibold mb-4">Gráficos</PageTitle>
              {allTransactions.length > 0 ? (
                <TransactionChart transactions={allTransactions} />
              ) : (
                <p className="text-gray-400">Sem dados para o gráfico.</p>
              )}
            </Card>
          </div>

          {/* Coluna Direita (Ações e Contas) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Botões de Ação */}
            <Card className="p-4">
              <div className="flex flex-col gap-3">
                <Button variant="success" onClick={() => handleOpenModal('ENTRADA')}>
                  Entradas <ArrowUp size={20} />
                </Button>
                <Button variant="info" onClick={() => handleOpenModal('MOVIMENTACAO')}>
                  Movimentações <ArrowRightLeft size={20} />
                </Button>
                <Button variant="danger" onClick={() => handleOpenModal('SAIDA')}>
                  Saídas <ArrowDown size={20} />
                </Button>
              </div>
            </Card>

            {/* Lista de Contas */}
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <PageTitle level={2} className="text-xl font-semibold">Contas</PageTitle>
                <button className="text-brand-primary hover:text-brand-primary-hover">
                  <PlusCircle size={22} />
                </button>
              </div>
              <div className="space-y-3">
                {accounts.length > 0 ? accounts.map(account => (
                  <div key={account.id} className="flex justify-between items-center">
                    <p className="font-medium text-gray-200">{account.name}</p>
                    <p className="text-gray-300 font-mono">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.currentBalance)}</p>
                  </div>
                )) : <p className="text-gray-400">Nenhuma conta encontrada.</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Transação (reutilizado) */}
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