import React from 'react';

const StatCard = ({ title, value, colorClass }) => (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
        <p className={`text-2xl font-bold ${colorClass}`}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}</p>
    </div>
);

function MonthSummaryCard({ stats }) {
    const { totalIncomes, totalExpenses } = stats;
    const finalBalance = totalIncomes - totalExpenses;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Incomes (this month)" value={totalIncomes} colorClass="text-green-600" />
            <StatCard title="Total Expenses (this month)" value={totalExpenses} colorClass="text-red-600" />
            <StatCard title="Final Balance" value={finalBalance} colorClass="text-blue-600 dark:text-blue-400" />
        </div>
    );
}

export default MonthSummaryCard;
