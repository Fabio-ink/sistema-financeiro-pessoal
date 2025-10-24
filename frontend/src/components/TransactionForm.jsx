import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TransactionForm({ transaction, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        creationDate: new Date().toISOString().split('T')[0],
        transactionType: 'SAIDA',
        categoryId: '',
        accountId: ''
    });
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, accRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/accounts')
                ]);
                setCategories(catRes.data);
                setAccounts(accRes.data);

                if (transaction) {
                    setFormData({
                        name: transaction.name,
                        amount: transaction.amount,
                        creationDate: transaction.creationDate,
                        transactionType: transaction.transactionType,
                        categoryId: transaction.category?.id || '',
                        accountId: transaction.outAccount?.id || transaction.inAccount?.id || ''
                    });
                } else if (accRes.data.length > 0) {
                    // Padrão para a primeira conta se for uma nova transação
                    setFormData(prev => ({ ...prev, accountId: accRes.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch categories or accounts", err);
                setError("Could not load required data. Please try again later.");
            }
        };
        fetchData();
    }, [transaction]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.amount || !formData.creationDate || !formData.categoryId || !formData.accountId) {
            setError("Please fill in all fields.");
            return;
        }

        const dataToSave = {
            ...formData,
            amount: parseFloat(formData.amount),
            category: { id: formData.categoryId },
            // Define a conta de entrada ou saída com base no tipo de transação
            ...(formData.transactionType === 'SAIDA' 
                ? { outAccount: { id: formData.accountId } } 
                : { inAccount: { id: formData.accountId } })
        };
        // Remove os campos que não fazem parte do DTO de transação para evitar erros
        delete dataToSave.categoryId;
        delete dataToSave.accountId;


        try {
            if (transaction && transaction.id) {
                await api.put(`/transactions/${transaction.id}`, dataToSave);
            } else {
                await api.post('/transactions', dataToSave);
            }
            onSave();
        } catch (err) {
            console.error("Failed to save transaction", err);
            setError(err.response?.data?.message || "An error occurred while saving.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {transaction ? 'Edit Transaction' : 'New Transaction'}
                </h2>
                {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-2 rounded mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                        <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="creationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input type="date" name="creationDate" id="creationDate" value={formData.creationDate} onChange={handleChange}
                               className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                        <select name="transactionType" id="transactionType" value={formData.transactionType} onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="SAIDA">Expense</option>
                            <option value="ENTRADA">Income</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select name="categoryId" id="categoryId" value={formData.categoryId} onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select a category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account</label>
                        <select name="accountId" id="accountId" value={formData.accountId} onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Select an account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransactionForm;
