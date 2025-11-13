import React, { useState, useMemo, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import TransactionForm from '../components/TransactionForm';
import Button from '../components/ui/Button';
import PageTitle from '../components/ui/PageTitle';
import Card from '../components/ui/Card';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import MonthlyPlanningPage from './MonthlyPlanningPage';
import Checkbox from '../components/ui/Checkbox';

function TransactionsPage() {
    const { items: transactions, loading, error, addItem, updateItem, deleteMultipleItems, fetchItems } = useCrud('/transactions');
    const { items: categories, fetchItems: fetchCategories } = useCrud('/categories');
    const { items: accounts, fetchItems: fetchAccounts } = useCrud('/accounts');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedTransactions, setSelectedTransactions] = useState(new Set());
    const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'planning'

    // Filter states
    const [filterName, setFilterName] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchAccounts();
        handleApplyFilters(); // Initial fetch with filters
    }, [fetchCategories, fetchAccounts]);

    const handleApplyFilters = () => {
        const params = {};
        if (filterName) params.name = filterName;
        if (filterStartDate) params.startDate = filterStartDate;
        if (filterEndDate) params.endDate = filterEndDate;
        if (filterCategory) params.categoryId = filterCategory;
        if (filterType) params.transactionType = filterType;
        fetchItems(params);
    };

    const handleClearFilters = () => {
        setFilterName('');
        setFilterStartDate('');
        setFilterEndDate('');
        setFilterCategory('');
        setFilterType('');
        fetchItems({}); // Fetch all items without filters
    };

    const handleSave = async (transactionData) => {
        if (selectedTransaction) {
            await updateItem(selectedTransaction.id, transactionData);
        } else {
            await addItem(transactionData);
        }
        setIsModalOpen(false);
        setSelectedTransaction(null);
        handleApplyFilters(); // Re-apply filters after save
    };

    const handleDeleteSelected = async () => {
        await deleteMultipleItems(Array.from(selectedTransactions));
        setSelectedTransactions(new Set());
        handleApplyFilters(); // Re-apply filters after delete
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

    const isAllSelected = useMemo(() => 
        transactions.length > 0 && selectedTransactions.size === transactions.length,
        [selectedTransactions.size, transactions.length]
    );

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <PageTitle>{activeTab === 'transactions' ? 'All Transactions' : 'Monthly Planning'}</PageTitle>
                    <div className="flex items-center space-x-2">
                        <Button 
                            variant={activeTab === 'transactions' ? 'primary' : 'ghost'}
                            onClick={() => setActiveTab('transactions')}>
                            Transactions
                        </Button>
                        <Button 
                            variant={activeTab === 'planning' ? 'primary' : 'ghost'}
                            onClick={() => setActiveTab('planning')}>
                            Monthly Planning
                        </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {activeTab === 'transactions' && selectedTransactions.size > 0 && (
                        <Button 
                            variant="danger"
                            onClick={handleDeleteSelected}>
                            Delete Selected ({selectedTransactions.size})
                        </Button>
                    )}
                    {activeTab === 'transactions' && (
                        <Button 
                            variant="success"
                            onClick={() => { setSelectedTransaction(null); setIsModalOpen(true); }}>
                            + New Transaction
                        </Button>
                    )}
                </div>
            </div>

            {activeTab === 'transactions' && (
                <Card className="mb-6 p-4">
                    <PageTitle level={3} className="mb-4">Filter Transactions</PageTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Input 
                            label="Name"
                            type="text"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            placeholder="Filter by name"
                        />
                        <Input 
                            label="Start Date"
                            type="date"
                            value={filterStartDate}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                        />
                        <Input 
                            label="End Date"
                            type="date"
                            value={filterEndDate}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                        />
                        <Select
                            label="Category"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </Select>
                        <Select
                            label="Type"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="ENTRADA">Revenue</option>
                            <option value="SAIDA">Expense</option>
                            <option value="MOVIMENTACAO">Transfer</option>
                        </Select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="secondary" onClick={handleClearFilters}>Clear Filters</Button>
                        <Button variant="primary" onClick={handleApplyFilters}>Apply Filters</Button>
                    </div>
                </Card>
            )}

            {activeTab === 'transactions' ? (
                loading ? (
                    <Spinner />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : (
                    <Card className="overflow-hidden">
                        {transactions.length > 0 ? (
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            <Checkbox id="selectAllTransactions" checked={isAllSelected} onChange={handleSelectAll} />
                                        </th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Account</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800">
                                    {transactions.map(t => (
                                        <tr key={t.id} className={`dark:bg-gray-800 ${selectedTransactions.has(t.id) ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                                <Checkbox id={`transaction-${t.id}`} checked={selectedTransactions.has(t.id)} onChange={() => handleSelect(t.id)} />
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                                <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{t.name}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                                <p className={`whitespace-no-wrap ${t.transactionType === 'SAIDA' ? 'text-red-600' : 'text-green-600'}`}>
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                                <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{t.category?.name || 'N/A'}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                                <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{t.outAccount?.name || t.inAccount?.name || 'N/A'}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                                <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{new Date(t.creationDate).toLocaleDateString('pt-BR')}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                                                <Button 
                                                    variant="warning"
                                                    size="sm"
                                                    onClick={() => { setSelectedTransaction(t); setIsModalOpen(true); }}>Edit</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center p-6">
                                <p className="text-gray-500 dark:text-gray-400">No transactions found. Click '+ New Transaction' to add one.</p>
                            </div>
                        )}
                    </Card>
                )
            ) : (
                <MonthlyPlanningPage categories={categories} />
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
