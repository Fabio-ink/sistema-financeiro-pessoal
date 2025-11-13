import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import PageTitle from './ui/PageTitle';
import { useCrud } from '../hooks/useCrud';

function TransactionForm({ transaction, onSave, onCancel, categories, accounts }) {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        creationDate: new Date().toISOString().split('T')[0],
        transactionType: 'SAIDA',
        categoryId: '',
        outAccountId: '',
        inAccountId: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (transaction) {
            setFormData({
                name: transaction.name || '',
                amount: transaction.amount || '',
                creationDate: transaction.creationDate ? new Date(transaction.creationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                transactionType: transaction.transactionType || 'SAIDA',
                categoryId: transaction.category?.id || '',
                outAccountId: transaction.outAccount?.id || '',
                inAccountId: transaction.inAccount?.id || ''
            });
        } else {
            setFormData({
                name: '',
                amount: '',
                creationDate: new Date().toISOString().split('T')[0],
                transactionType: 'SAIDA',
                categoryId: '',
                outAccountId: '',
                inAccountId: ''
            });
        }
    }, [transaction]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};
        if (parseFloat(formData.amount) <= 0) {
            errors.amount = "Amount must be a positive number.";
        }
        if (!formData.name) {
            errors.name = "Name is required.";
        }
        if (!formData.creationDate) {
            errors.date = "Date is required.";
        }
        if (formData.transactionType === 'SAIDA' && !formData.categoryId) {
            errors.category = "Category is required for expenses.";
        }
        // Add more validations as needed

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

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
        <div>
            <PageTitle level={2} className="mb-6">{transaction ? 'Edit Transaction' : 'New Transaction'}</PageTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input name="name" label="Name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                    <Input name="amount" label="Amount" type="number" step="0.01" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
                    {formErrors.amount && <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>}
                </div>
                <div>
                    <Input name="creationDate" label="Date" type="date" value={formData.creationDate} onChange={handleChange} required />
                    {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>
                
                <Select name="transactionType" label="Transaction Type" value={formData.transactionType} onChange={handleChange}>
                    <option value="SAIDA">Expense (Saída)</option>
                    <option value="ENTRADA">Income (Entrada)</option>
                    <option value="MOVIMENTACAO">Transfer (Movimentação)</option>
                </Select>
                
                <Select name="categoryId" label="Category" value={formData.categoryId} onChange={handleChange}>
                    <option value="">Select a Category (Optional)</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </Select>
                {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}

                {formData.transactionType === 'SAIDA' && (
                     <Select name="outAccountId" label="Outcome Account" value={formData.outAccountId} onChange={handleChange}>
                        <option value="">Select Outcome Account</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </Select>
                )}

                {formData.transactionType === 'ENTRADA' && (
                     <Select name="inAccountId" label="Income Account" value={formData.inAccountId} onChange={handleChange}>
                        <option value="">Select Income Account</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </Select>
                )}

                {formData.transactionType === 'MOVIMENTACAO' && (
                    <>
                        <Select name="outAccountId" label="Outcome Account" value={formData.outAccountId} onChange={handleChange}>
                            <option value="">Select Outcome Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </Select>
                        <Select name="inAccountId" label="Income Account" value={formData.inAccountId} onChange={handleChange}>
                            <option value="">Select Income Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </Select>
                    </>
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
        </div>
    );
}

export default TransactionForm;
