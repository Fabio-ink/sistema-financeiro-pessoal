import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import PageTitle from './ui/PageTitle';

import DatePicker from './ui/DatePicker';

function TransactionForm({ transaction, onSave, onCancel, categories, accounts }) {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        creationDate: new Date().toISOString().split('T')[0],
        transactionType: 'SAIDA',
        categoryId: '',
        outAccountId: '',
        inAccountId: '',
        totalInstallments: 1
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
                inAccountId: transaction.inAccount?.id || '',
                totalInstallments: transaction.totalInstallments || 1
            });
        } else {
            setFormData({
                name: '',
                amount: '',
                creationDate: new Date().toISOString().split('T')[0],
                transactionType: 'SAIDA',
                categoryId: '',
                outAccountId: '',
                inAccountId: '',
                totalInstallments: 1
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

        // Validation for Expense (SAIDA)
        if (formData.transactionType === 'SAIDA') {
            if (!formData.categoryId) errors.category = "Category is required for expenses.";
            if (!formData.outAccountId) errors.outAccount = "Outcome Account is required.";
        }

        // Validation for Credit Card (CARTAO)
        if (formData.transactionType === 'CARTAO') {
             if (!formData.categoryId) errors.category = "Category is required for credit card expenses.";
             // Assuming Credit Card also needs an account (the card itself)
             // if (!formData.outAccountId) errors.outAccount = "Account is required."; 
             // User said: "ao adicionar um novo gasto ... obrigatórios ... conta"
             // So I will enforce it.
             if (!formData.outAccountId) errors.outAccount = "Credit Card Account is required.";
        }

        // Validation for Transfer (MOVIMENTACAO)
        if (formData.transactionType === 'MOVIMENTACAO') {
            if (!formData.outAccountId) errors.outAccount = "Outcome Account is required.";
            if (!formData.inAccountId) errors.inAccount = "Income Account is required.";
        }

        // Validation for Income (ENTRADA)
        if (formData.transactionType === 'ENTRADA') {
            if (!formData.inAccountId) errors.inAccount = "Income Account is required.";
            // Category is optional for Income
        }

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
            totalInstallments: formData.transactionType === 'CARTAO' ? parseInt(formData.totalInstallments) : 1
        };
        
        if (transaction && transaction.id) {
            submissionData.id = transaction.id;
        }

        onSave(submissionData);
    };


    return (
        <div>
            <PageTitle level={2} className="mb-6">
                {transaction ? 'Edit Transaction' : (formData.transactionType === 'CARTAO' ? 'Gasto no Cartão' : 'New Transaction')}
            </PageTitle>
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
                    <DatePicker name="creationDate" label="Date" value={formData.creationDate} onChange={handleChange} required />
                    {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>
                
                {formData.transactionType !== 'CARTAO' && (
                    <Select name="transactionType" label="Transaction Type" value={formData.transactionType} onChange={handleChange}>
                        <option value="SAIDA">Expense (Saída)</option>
                        <option value="ENTRADA">Income (Entrada)</option>
                        <option value="MOVIMENTACAO">Transfer (Movimentação)</option>
                        <option value="CARTAO">Credit Card (Cartão de Crédito)</option>
                    </Select>
                )}
                
                {formData.transactionType === 'CARTAO' && (
                    <div>
                        <Input name="totalInstallments" label="Total de Parcelas" type="number" min="1" value={formData.totalInstallments} onChange={handleChange} required />
                    </div>
                )}

                <Select name="categoryId" label="Category" value={formData.categoryId} onChange={handleChange}>
                    <option value="">Select a Category (Optional)</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </Select>
                {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}

                {(formData.transactionType === 'SAIDA' || formData.transactionType === 'CARTAO') && (
                    <div>
                     <Select name="outAccountId" label={formData.transactionType === 'CARTAO' ? "Credit Card Account" : "Outcome Account"} value={formData.outAccountId} onChange={handleChange}>
                        <option value="">{formData.transactionType === 'CARTAO' ? "Select Credit Card" : "Select Outcome Account"}</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </Select>
                    {formErrors.outAccount && <p className="text-red-500 text-xs mt-1">{formErrors.outAccount}</p>}
                    </div>
                )}

                {formData.transactionType === 'ENTRADA' && (
                    <div>
                     <Select name="inAccountId" label="Income Account" value={formData.inAccountId} onChange={handleChange}>
                        <option value="">Select Income Account</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </Select>
                    {formErrors.inAccount && <p className="text-red-500 text-xs mt-1">{formErrors.inAccount}</p>}
                    </div>
                )}

                {formData.transactionType === 'MOVIMENTACAO' && (
                    <>
                        <div>
                        <Select name="outAccountId" label="Outcome Account" value={formData.outAccountId} onChange={handleChange}>
                            <option value="">Select Outcome Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </Select>
                        {formErrors.outAccount && <p className="text-red-500 text-xs mt-1">{formErrors.outAccount}</p>}
                        </div>
                        <div>
                        <Select name="inAccountId" label="Income Account" value={formData.inAccountId} onChange={handleChange}>
                            <option value="">Select Income Account</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </Select>
                        {formErrors.inAccount && <p className="text-red-500 text-xs mt-1">{formErrors.inAccount}</p>}
                        </div>
                    </>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                      Salvar
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default TransactionForm;
