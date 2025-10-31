import React, { useState, useMemo } from 'react';
import { useCrud } from '../hooks/useCrud';
import TransactionForm from '../components/TransactionForm';
import Button from '../components/ui/Button';
import PageTitle from '../components/ui/PageTitle';
import Card from '../components/ui/Card';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/ui/Modal';

function TransactionsPage() {
    const { items: transactions, loading, error, addItem, updateItem, deleteMultipleItems } = useCrud('/transactions');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedTransactions, setSelectedTransactions] = useState(new Set());

    const handleSave = async (transactionData) => {
        if (selectedTransaction) {
            await updateItem(selectedTransaction.id, transactionData);
        } else {
            await addItem(transactionData);
        }
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const handleDeleteSelected = async () => {
        await deleteMultipleItems(Array.from(selectedTransactions));
        setSelectedTransactions(new Set());
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
                <PageTitle>All Transactions</PageTitle>
                <div className="flex items-center space-x-2">
                    {selectedTransactions.size > 0 && (
                        <Button 
                            variant="danger"
                            onClick={handleDeleteSelected}>
                            Delete Selected ({selectedTransactions.size})
                        </Button>
                    )}
                    <Button 
                        variant="success"
                        onClick={() => { setSelectedTransaction(null); setIsModalOpen(true); }}>
                        + New Transaction
                    </Button>
                </div>
            </div>

            {loading ? (
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
                                        <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
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
                                            <input type="checkbox" checked={selectedTransactions.has(t.id)} onChange={() => handleSelect(t.id)} />
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
            )}

            <Modal isOpen={isModalOpen} onCancel={() => setIsModalOpen(false)}>
                <TransactionForm 
                    transaction={selectedTransaction} 
                    onSave={handleSave} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>
        </div>
    );
}

export default TransactionsPage;
