import { Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import IconButton from './ui/IconButton';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

// formatDate is imported from utils

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
                            <IconButton 
                                onClick={() => onEdit(transaction)}
                                color="primary"
                                title="Editar"
                            >
                                <Edit2 size={16} />
                            </IconButton>
                            <IconButton 
                                onClick={() => onDelete && onDelete(transaction)}
                                color="danger"
                                title="Excluir"
                            >
                                <Trash2 size={16} />
                            </IconButton>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TransactionList;
