import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from './ui/Card';
import Button from './ui/Button';

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
            if (t.transactionType === 'ENTRADA') {
                cumulative += t.amount;
            } else if (t.transactionType === 'SAIDA') {
                cumulative -= t.amount;
            }
            return {
                date: new Date(t.creationDate).toLocaleDateString('pt-BR'),
                amount: t.amount,
                type: t.transactionType,
                balance: cumulative
            };
        });
    }, [transactions, filter]);

    return (
        <Card className="p-4">
            <div className="flex justify-center mb-4">
                <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'primary' : 'secondary'} className="mx-2">All</Button>
                <Button onClick={() => setFilter('income')} variant={filter === 'income' ? 'success' : 'secondary'} className="mx-2">Income</Button>
                <Button onClick={() => setFilter('expenses')} variant={filter === 'expenses' ? 'danger' : 'secondary'} className="mx-2">Expenses</Button>
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
        </Card>
    );
};

export default TransactionChart;
