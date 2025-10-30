import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TransactionChart = ({ transactions }) => {
    const [filter, setFilter] = useState('all');

    const filteredData = useMemo(() => {
        let filtered = transactions;
        if (filter === 'income') {
            filtered = transactions.filter(t => t.transactionType === 'ENTRADA');
        } else if (filter === 'expenses') {
            filtered = transactions.filter(t => t.transactionType === 'SAIDA');
        }

        // Sort transactions by date
        const sorted = filtered.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));

        // Calculate cumulative sum
        let cumulative = 0;
        return sorted.map(t => {
            cumulative += t.transactionType === 'ENTRADA' ? t.amount : -t.amount;
            return {
                date: new Date(t.creationDate).toLocaleDateString('pt-BR'),
                amount: t.amount,
                type: t.transactionType,
                balance: cumulative
            };
        });
    }, [transactions, filter]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 mx-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
                <button onClick={() => setFilter('income')} className={`px-4 py-2 mx-2 rounded-lg ${filter === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Income</button>
                <button onClick={() => setFilter('expenses')} className={`px-4 py-2 mx-2 rounded-lg ${filter === 'expenses' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Expenses</button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionChart;
