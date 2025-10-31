import React from 'react';
import Card from './Card';

// Função para formatar valores como moeda (BRL)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

function MonthSummaryCard({ title, totalSpent, totalIncome, plannedBudget }) {
    const percentageSpent = plannedBudget > 0 ? (totalSpent / plannedBudget) * 100 : 0;

    return (
        <Card className="p-4 flex flex-col gap-3">
            <h3 className="font-semibold text-white">{title}</h3>

            <div className="text-sm space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-400">Valor total Gasto</span>
                    <span className="font-medium text-red-400">{formatCurrency(totalSpent)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Entradas</span>
                    <span className="font-medium text-green-400">{formatCurrency(totalIncome)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Valor total planejado</span>
                    <span className="font-medium text-gray-300">{formatCurrency(plannedBudget)}</span>
                </div>
            </div>

            <div className="mt-auto">
                <p className="text-sm text-gray-400">Porcentagem Gasta</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(percentageSpent, 100)}%` }} // Garante que a barra não passe de 100%
                    ></div>
                </div>
                <p className="text-right text-xs font-mono mt-1">{percentageSpent.toFixed(1)}%</p>
            </div>
        </Card>
    );
}

export default MonthSummaryCard;
