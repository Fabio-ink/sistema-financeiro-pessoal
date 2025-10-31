import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Modal from './Modal';

function TransactionForm({ transaction, onSave, onCancel, isOpen }) {
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


    return (
        <Modal isOpen={isOpen} onCancel={onCancel}>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{transaction ? 'Edit Transaction' : 'New Transaction'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                <Input name="amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
                <Input name="creationDate" type="date" value={formData.creationDate} onChange={handleChange} required />
                
                <Select name="transactionType" value={formData.transactionType} onChange={handleChange}>
                    <option value="SAIDA">Expense (Saída)</option>
                    <option value="ENTRADA">Income (Entrada)</option>
                </Select>
                
                <Select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                    <option value="">Select a Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </Select>

                {formData.transactionType === 'SAIDA' && (
                     <Select name="outAccountId" value={formData.outAccountId} onChange={handleChange}>
                        <option value="">Select Outcome Account</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </Select>
                )}

                {formData.transactionType === 'ENTRADA' && (
                     <Select name="inAccountId" value={formData.inAccountId} onChange={handleChange}>
                        <option value="">Select Income Account</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </Select>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="ghost" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default TransactionForm;
