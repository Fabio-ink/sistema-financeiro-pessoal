import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction, updateTransaction, deleteAccount } from '../services/api'; 
import MonthSummaryCard from '../components/MonthSummaryCard';
import TransactionChart from '../components/TransactionChart';
import Card from '../components/ui/Card';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import PageTitle from '../components/ui/PageTitle';
import Input from '../components/ui/Input';
import DashboardAction from '../components/DashboardAction';
import { PlusCircle } from 'lucide-react'; 
import api from '../services/api';
import AccountForm from '../components/AccountForm';
import AccountsListModal from '../components/AccountsListModal';

function DashboardPage() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  
  // Account Modals State
  const [isAccountFormModalOpen, setAccountFormModalOpen] = useState(false);
  const [isAccountsListModalOpen, setAccountsListModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);

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

  // Account Handlers
  const handleOpenAccountForm = useCallback((account = null) => {
    setAccountToEdit(account);
    setAccountFormModalOpen(true);
    setAccountsListModalOpen(false); // Close list if open
  }, []);

  const handleCloseAccountForm = useCallback(() => {
    setAccountToEdit(null);
    setAccountFormModalOpen(false);
  }, []);

  const handleOpenAccountsList = useCallback(() => {
    setAccountsListModalOpen(true);
  }, []);

  const handleCloseAccountsList = useCallback(() => {
    setAccountsListModalOpen(false);
  }, []);

  const handleSaveTransaction = useCallback(async (transactionData) => {
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

  const handleSaveAccount = useCallback(() => {
    handleCloseAccountForm();
    fetchAllData();
  }, [handleCloseAccountForm, fetchAllData]);

  const handleDeleteAccount = useCallback(async (accountId) => {
    try {
        await deleteAccount(accountId);
        handleCloseAccountForm();
        fetchAllData();
    } catch (error) {
        console.error("Error deleting account", error);
        alert("Erro ao excluir conta. Verifique se existem transações vinculadas.");
    }
  }, [handleCloseAccountForm, fetchAllData]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      <div className="container mx-auto space-y-8 p-4">
        
        {/* Row 1: Monthly Summaries */}
        {monthlySummary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MonthSummaryCard title="October" {...monthlySummary.previous} />
            <MonthSummaryCard title="November" {...monthlySummary.current} />
            <MonthSummaryCard title="December" {...monthlySummary.next} />
          </div>
        ) : (
          <p className="text-gray-400">Loading monthly summaries...</p>
        )}
        
        {/* Row 2: Chart & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
          {/* Chart (2/3) */}
          <div className="lg:col-span-2 min-h-[400px]">
            <Card className="p-6 h-full flex flex-col bg-brand-card rounded-2xl border border-brand-border/30 shadow-lg">
              <PageTitle level={2} className="text-xl font-bold mb-6 text-white">Gráficos</PageTitle>
              <div className="flex-1 min-h-0">
                {allTransactions.length > 0 ? (
                  <TransactionChart transactions={allTransactions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-text-secondary">
                    Sem dados para o gráfico.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Actions (1/3) */}
          <div className="lg:col-span-1 flex flex-col gap-4 justify-start">
             <DashboardAction 
                variant="success" 
                label="Entradas" 
                onClick={() => handleOpenModal('ENTRADA')} 
             />

             <DashboardAction 
                variant="primary" 
                label="Movimentações" 
                onClick={() => handleOpenModal('MOVIMENTACAO')} 
             />

             <DashboardAction 
                variant="danger" 
                label="Saídas" 
                onClick={() => handleOpenModal('SAIDA')} 
             />

             <DashboardAction 
                variant="info" 
                label="Gasto no Cartão" 
                onClick={() => handleOpenModal('CARTAO')} 
             />
          </div>
        </div>

        {/* Row 3: Transactions & Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions List (2/3) */}
            <div className="lg:col-span-2">
                <Card className="p-6 bg-brand-card rounded-2xl border border-brand-border/30 shadow-lg min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <PageTitle level={2} className="text-xl font-bold text-white">Transações Recentes</PageTitle>
                        <button 
                            onClick={() => navigate('/transactions')}
                            className="text-sm text-brand-primary hover:text-brand-primary-hover transition-colors cursor-pointer"
                        >
                            Ver todas
                        </button>
                    </div>
                    <TransactionList 
                        transactions={allTransactions.slice(0, 4)} 
                        onEdit={(t) => {
                            setTransactionToEdit(t);
                            setTransactionModalOpen(true);
                        }}
                        onDelete={async (t) => {
                            if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
                                try {
                                    await api.delete(`/transactions/${t.id}`);
                                    fetchAllData();
                                } catch (error) {
                                    console.error("Error deleting transaction", error);
                                }
                            }
                        }}
                    />
                </Card>
            </div>

            {/* Accounts List (1/3) */}
            <div className="lg:col-span-1">
                <Card className="p-6 bg-brand-card rounded-2xl border border-brand-border/30 shadow-lg min-h-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <PageTitle 
                          level={2} 
                          className="text-xl font-bold text-white cursor-pointer hover:text-brand-primary transition-colors"
                          onClick={handleOpenAccountsList}
                        >
                          Contas
                        </PageTitle>
                        <button 
                        onClick={() => handleOpenAccountForm(null)} 
                        className="text-brand-primary hover:text-brand-primary-hover transition-colors cursor-pointer"
                        title="Nova Conta"
                        >
                        <PlusCircle size={24} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {accounts.length > 0 ? accounts.map(account => (
                        <div 
                          key={account.id} 
                          className="flex justify-between items-center p-3 rounded-xl bg-brand-dark/30 border border-brand-border/20 hover:border-brand-border/50 transition-colors group cursor-pointer"
                          onClick={() => handleOpenAccountForm(account)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-brand-primary rounded-full"></div>
                                <p className="font-medium text-gray-200 group-hover:text-white transition-colors">{account.name}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-gray-300 font-mono font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.currentBalance)}</p>
                            </div>
                        </div>
                        )) : <p className="text-gray-400 text-center py-4">Nenhuma conta encontrada.</p>}
                    </div>
                </Card>
            </div>
        </div>

      </div>

      {/* Modal de Transação */}
      <Modal isOpen={isTransactionModalOpen} onCancel={handleCloseModal}>
        <TransactionForm
          onSave={handleSaveTransaction}
          onCancel={handleCloseModal}
          transaction={transactionToEdit}
          accounts={accounts}
          categories={categories}
        />
      </Modal>

      {/* Modal de Formulário de Conta (Criar/Editar) */}
      <Modal isOpen={isAccountFormModalOpen} onCancel={handleCloseAccountForm}>
        <PageTitle level={2} className="text-xl font-semibold mb-4 text-white">
          {accountToEdit ? 'Editar Conta' : 'Nova Conta'}
        </PageTitle>
        <AccountForm 
          account={accountToEdit} 
          onSave={handleSaveAccount} 
          onCancel={handleCloseAccountForm}
          onDelete={handleDeleteAccount}
        />
      </Modal>

      {/* Modal de Lista de Contas */}
      <Modal isOpen={isAccountsListModalOpen} onCancel={handleCloseAccountsList}>
        <PageTitle level={2} className="text-xl font-semibold mb-4 text-white">Todas as Contas</PageTitle>
        <AccountsListModal 
          accounts={accounts} 
          onEdit={handleOpenAccountForm} 
          onClose={handleCloseAccountsList} 
        />
      </Modal>
    </>
  );
}

export default DashboardPage;