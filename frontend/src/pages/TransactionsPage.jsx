import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionForm from '../components/TransactionForm';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSave = async (transactionData) => {
        try {
            if (selectedTransaction) {
                await api.put(`/transactions/${selectedTransaction.id}`, transactionData);
            } else {
                await api.post('/transactions', transactionData);
            }
            setIsModalOpen(false);
            fetchTransactions();
        } catch (error) {
            console.error("Error saving transaction:", error);
            alert("Failed to save transaction. Please check the console for details.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                alert('Error deleting transaction:', error);
            }
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-white">All Transactions</h1>
                <button 
                    onClick={() => { setSelectedTransaction(null); setIsModalOpen(true); }}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                    + New Transaction
                </button>
            </div>

            {/* Tabela de Transações */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
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
                            <tr key={t.id} className="dark:bg-gray-800">
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
                                    <button 
                                        onClick={() => { setSelectedTransaction(t); setIsModalOpen(true); }}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg mr-2">Edit</button>
                                    <button onClick={() => handleDelete(t.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <TransactionForm 
                    transaction={selectedTransaction} 
                    onSave={handleSave} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}

export default TransactionsPage