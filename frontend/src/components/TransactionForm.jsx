import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TransactionForm({ transactionToEdit, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        creationDate: new Date().toISOString().split('T')[0], // Data de hoje por padrão
        transactionType: 'SAIDA',
        categoryId: '',
        outAccountId: '',
        inAccountId: ''
    });

    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);

    // Busca categorias e contas para preencher os dropdowns
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
    
    // Se estivermos editando, preenche o formulário com os dados da transação
    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                name: transactionToEdit.name,
                amount: transactionToEdit.amount,
                creationDate: new Date(transactionToEdit.creationDate).toISOString().split('T')[0],
                transactionType: transactionToEdit.transactionType,
                categoryId: transactionToEdit.category?.id || '',
                outAccountId: transactionToEdit.outAccount?.id || '',
                inAccountId: transactionToEdit.inAccount?.id || ''
            });
        }
    }, [transactionToEdit]);


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
        
        // Se for uma edição, adiciona o ID
        if (transactionToEdit) {
            submissionData.id = transactionToEdit.id;
        }

        onSave(submissionData);
    };

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Content */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{transactionToEdit ? 'Edit Transaction' : 'New Transaction'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" required />
                    <input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} placeholder="Amount" className="w-full p-2 border rounded" required />
                    <input name="creationDate" type="date" value={formData.creationDate} onChange={handleChange} className="w-full p-2 border rounded" required />
                    
                    <select name="transactionType" value={formData.transactionType} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="SAIDA">Expense (Saída)</option>
                        <option value="ENTRADA">Income (Entrada)</option>
                    </select>
                    
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Select a Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>

                    {formData.transactionType === 'SAIDA' && (
                         <select name="outAccountId" value={formData.outAccountId} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select Outcome Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                    )}

                    {formData.transactionType === 'ENTRADA' && (
                         <select name="inAccountId" value={formData.inAccountId} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Select Income Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TransactionForm;
