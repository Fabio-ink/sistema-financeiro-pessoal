import React, { useState, useMemo, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { useToast } from '../contexts/ToastContext';
import TransactionForm from '../components/TransactionForm';
import Button from '../components/ui/Button';
import PageTitle from '../components/ui/PageTitle';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import MonthlyPlanningPage from './MonthlyPlanningPage';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import { formatCurrency } from '../utils/dateUtils';

function TransactionsPage() {
    const { items: transactions, loading, error, addItem, updateItem, deleteMultipleItems, fetchItems, pagination } = useCrud('/transactions');
    const { items: categories, fetchItems: fetchCategories } = useCrud('/categories');
    const { items: accounts, fetchItems: fetchAccounts } = useCrud('/accounts');
    
    const { filters, handleChange, clearFilters, getFilterParams } = useTransactionFilters();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedTransactions, setSelectedTransactions] = useState(new Set());
    const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'planning'
    
    // Pagination states
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchCategories();
        fetchAccounts();
        fetchItems({ page, size: pageSize }); // Initial fetch without filters but with pagination
    }, [fetchCategories, fetchAccounts, fetchItems, page, pageSize]);

    const handleApplyFilters = () => {
        const params = getFilterParams();
        params.page = 0; // Reset to first page when filtering
        params.size = pageSize;
        setPage(0); // Update local state
        fetchItems(params);
    };

    const handleClearFilters = () => {
        clearFilters();
        setPage(0);
        fetchItems({ page: 0, size: pageSize }); // Fetch all items without filters
    };

    const handleSave = async (transactionData) => {
        try {
            if (selectedTransaction) {
                await updateItem(selectedTransaction.id, transactionData);
                addToast({ type: 'success', title: 'Sucesso', message: 'Transação atualizada com sucesso!' });
            } else {
                await addItem(transactionData);
                addToast({ type: 'success', title: 'Sucesso', message: 'Transação criada com sucesso!' });
            }
            setIsModalOpen(false);
            setSelectedTransaction(null);
            handleApplyFilters(); // Re-apply filters after save
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', message: 'Erro ao salvar transação.' });
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await deleteMultipleItems(Array.from(selectedTransactions));
            setSelectedTransactions(new Set());
            handleApplyFilters(); // Re-apply filters after delete
            addToast({ type: 'success', title: 'Sucesso', message: 'Transações excluídas com sucesso!' });
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', message: 'Erro ao excluir transações.' });
        }
    };

    const handleSelect = (transactionId) => {
        setSelectedTransactions(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(transactionId)) {
                newSelected.delete(transactionId);
            } else {
                newSelected.add(transactionId);
            }
            return newSelected;
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedTransactions(new Set(transactions.map(t => t.id)));
        } else {
            setSelectedTransactions(new Set());
        }
    };

    const pageTotal = useMemo(() => {
        return transactions.reduce((acc, t) => {
            const isExpense = t.transactionType === 'SAIDA' || t.transactionType === 'CARTAO';
            return acc + (isExpense ? -t.amount : t.amount);
        }, 0);
    }, [transactions]);

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <PageTitle>{activeTab === 'transactions' ? 'All Transactions' : 'Monthly Planning'}</PageTitle>
                    <div className="flex items-center space-x-2">
                        <Button 
                            variant={activeTab === 'transactions' ? 'primary' : 'ghost'}
                            onClick={() => setActiveTab('transactions')}>
                            Transações
                        </Button>
                        <Button 
                            variant={activeTab === 'planning' ? 'primary' : 'ghost'}
                            onClick={() => setActiveTab('planning')}>
                            Planejamento Mensal
                        </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {activeTab === 'transactions' && selectedTransactions.size > 0 && (
                        <Button 
                            variant="danger"
                            onClick={handleDeleteSelected}>
                            Excluir Selecionados ({selectedTransactions.size})
                        </Button>
                    )}
                    {activeTab === 'transactions' && (
                        <Button 
                            variant="success"
                            onClick={() => { setSelectedTransaction(null); setIsModalOpen(true); }}>
                            + Nova Transação
                        </Button>
                    )}
                </div>
            </div>

            {activeTab === 'transactions' && (
                <TransactionFilters 
                    filters={filters}
                    onChange={handleChange}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                    categories={categories}
                />
            )}

            {activeTab === 'transactions' ? (
                <TransactionTable 
                    transactions={transactions}
                    selectedTransactions={selectedTransactions}
                    onSelect={handleSelect}
                    onSelectAll={handleSelectAll}
                    onEdit={(t) => { setSelectedTransaction(t); setIsModalOpen(true); }}
                    loading={loading}
                    error={error}
                />
            ) : (
                <MonthlyPlanningPage categories={categories} />
            )}

            {activeTab === 'transactions' && pagination && (
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow gap-4">
                    <div className="flex items-center w-full md:w-auto">
                        <Select
                            label="Itens por página"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(0); // Reset to first page
                            }}
                            className="w-full md:w-48"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Select>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Total desta página</span>
                        <span className={`text-lg font-bold ${pageTotal < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(pageTotal)}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                        <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                            Página {pagination.number + 1} de {pagination.totalPages}
                        </span>
                        <div className="inline-flex rounded-md shadow-sm gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={pagination.first}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setPage(p => Math.min(pagination.totalPages - 1, p + 1))}
                                disabled={pagination.last}
                            >
                                Próxima
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Modal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)}>
                <TransactionForm 
                    transaction={selectedTransaction} 
                    onSave={handleSave} 
                    onCancel={() => setIsModalOpen(false)} 
                    categories={categories}
                    accounts={accounts}
                />
            </Modal>
        </div>
    );
}

export default TransactionsPage;
