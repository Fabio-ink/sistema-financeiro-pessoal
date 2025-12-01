import React from 'react';
import Card from '../ui/Card';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import Spinner from '../Spinner';
import ErrorMessage from '../ErrorMessage';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

const TransactionTable = ({ 
    transactions, 
    selectedTransactions, 
    onSelect, 
    onSelectAll, 
    onEdit, 
    loading, 
    error 
}) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage message={error} />;

    const isAllSelected = transactions.length > 0 && selectedTransactions.size === transactions.length;

    return (
        <Card className="overflow-hidden">
            {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    <Checkbox id="selectAllTransactions" checked={isAllSelected} onChange={onSelectAll} />
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Valor</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Categoria</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Conta</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Data</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800">
                            {transactions.map(t => (
                                <tr key={t.id} className={`dark:bg-gray-800 ${selectedTransactions.has(t.id) ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                        <Checkbox id={`transaction-${t.id}`} checked={selectedTransactions.has(t.id)} onChange={() => onSelect(t.id)} />
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                        <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{t.name}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                        <p className={`whitespace-no-wrap ${(t.transactionType === 'SAIDA' || t.transactionType === 'CARTAO') ? 'text-red-600' : 'text-green-600'}`}>
                                            {formatCurrency(t.amount)}
                                        </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                        <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{t.category?.name || 'N/A'}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                        <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{t.outAccount?.name || t.inAccount?.name || 'N/A'}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
                                        <p className="text-gray-900 dark:text-gray-200 whitespace-no-wrap">{formatDate(t.creationDate)}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm text-right">
                                        <Button 
                                            variant="warning"
                                            size="sm"
                                            onClick={() => onEdit(t)}>Editar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center p-6">
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma transação encontrada. Clique em '+ Nova Transação' para adicionar uma.</p>
                </div>
            )}
        </Card>
    );
};

export default TransactionTable;
