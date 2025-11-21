import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
};

function TransactionList({ transactions, onEdit, onDelete }) {
    if (!transactions || transactions.length === 0) {
        return <p className="text-text-secondary text-center py-8">Nenhuma transação recente.</p>;
    }

    // Take only the last 5 transactions for the dashboard
    const recentTransactions = [...transactions].sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)).slice(0, 5);

    return (
        <div className="space-y-3">
            {recentTransactions.map((transaction) => (
                <div 
                    key={transaction.id} 
                    className="group flex items-center justify-between p-4 rounded-xl bg-brand-dark/30 border border-brand-border/20 hover:border-brand-primary/30 hover:bg-brand-dark/50 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full ${
                            transaction.transactionType === 'ENTRADA' ? 'bg-brand-success' : 
                            transaction.transactionType === 'SAIDA' ? 'bg-brand-danger' : 'bg-brand-info'
                        }`}></div>
                        
                        <div>
                            <p className="font-semibold text-white">{transaction.name}</p>
                            <p className="text-xs text-text-secondary">{formatDate(transaction.creationDate)} • {transaction.category?.name || 'Sem categoria'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className={`font-bold font-mono ${
                            transaction.transactionType === 'ENTRADA' ? 'text-brand-success' : 
                            transaction.transactionType === 'SAIDA' ? 'text-brand-danger' : 'text-brand-info'
                        }`}>
                            {transaction.transactionType === 'SAIDA' ? '- ' : '+ '}
                            {formatCurrency(transaction.amount)}
                        </span>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => onEdit(transaction)}
                                className="p-2 text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => onDelete && onDelete(transaction)}
                                className="p-2 text-text-secondary hover:text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors"
                                title="Excluir"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TransactionList;
