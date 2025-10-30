import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TransactionForm({ transaction, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        creationDate: new Date().toISOString().split('T')[0],
        transactionType: 'SAIDA',
        categoryId: '',
        outAccountId: '',
        inAccountId: ''
    });

    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [categoriesRes, accountsRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/accounts')
                ]);
                setCategories(categoriesRes.data);
                setAccounts(accountsRes.data);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };
        fetchDropdownData();
    }, []);
    
    useEffect(() => {
        if (transaction) {
            setFormData({
                name: transaction.name,
                amount: transaction.amount,
                creationDate: new Date(transaction.creationDate).toISOString().split('T')[0],
                transactionType: transaction.transactionType,
                categoryId: transaction.category?.id || '',
                outAccountId: transaction.outAccount?.id || '',
                inAccountId: transaction.inAccount?.id || ''
            });
        }
    }, [transaction]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submissionData = {
            name: formData.name,
            amount: parseFloat(formData.amount),
            creationDate: formData.creationDate,
            transactionType: formData.transactionType,
            category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null,
            outAccount: formData.outAccountId ? { id: parseInt(formData.outAccountId) } : null,
            inAccount: formData.inAccountId ? { id: parseInt(formData.inAccountId) } : null,
        };
        
        if (transaction) {
            submissionData.id = transaction.id;
        }

        onSave(submissionData);
    };

    const inputClasses = "w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white";
    const selectClasses = "w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white";


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{transaction ? 'Edit Transaction' : 'New Transaction'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className={inputClasses} required />
                    <input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} placeholder="Amount" className={inputClasses} required />
                    <input name="creationDate" type="date" value={formData.creationDate} onChange={handleChange} className={inputClasses} required />
                    
                    <select name="transactionType" value={formData.transactionType} onChange={handleChange} className={selectClasses}>
                        <option value="SAIDA">Expense (Saída)</option>
                        <option value="ENTRADA">Income (Entrada)</option>
                    </select>
                    
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={selectClasses}>
                        <option value="">Select a Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>

                    {formData.transactionType === 'SAIDA' && (
                         <select name="outAccountId" value={formData.outAccountId} onChange={handleChange} className={selectClasses}>
                            <option value="">Select Outcome Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                    )}

                    {formData.transactionType === 'ENTRADA' && (
                         <select name="inAccountId" value={formData.inAccountId} onChange={handleChange} className={selectClasses}>
                            <option value="">Select Income Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransactionForm;
