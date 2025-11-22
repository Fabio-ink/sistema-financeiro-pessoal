import React from 'react';
import Card from './ui/Card';
import PageTitle from './ui/PageTitle';
import { Calendar } from 'lucide-react';

// Função para formatar valores como moeda (BRL)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

function MonthSummaryCard({ title, totalSpent, totalIncome, plannedBudget }) {
    const percentageSpent = plannedBudget > 0 ? (totalSpent / plannedBudget) * 100 : 0;

    return (
        <Card className="p-6 flex flex-col gap-4 bg-brand-card rounded-2xl border border-brand-border/30 shadow-lg relative overflow-hidden group hover:border-brand-primary/30 transition-colors">
            <div className="flex justify-between items-center">
                <PageTitle level={3} className="font-bold text-xl text-white">{title}</PageTitle>
                <div className="bg-brand-primary/20 p-2 rounded-full text-brand-primary">
                    <Calendar size={20} />
                </div>
            </div>

            <div className="text-sm space-y-3 mt-2">
                <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Valor gasto:</span>
                    <span className="font-medium text-white">{formatCurrency(totalSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Entradas:</span>
                    <span className="font-medium text-white">{formatCurrency(totalIncome)}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Gasto Planejado:</span>
                    <span className="font-medium text-white">{formatCurrency(plannedBudget)}</span>
                </div>
            </div>

            <div className="mt-auto pt-2">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Porcentagem Gasta:</span>
                    <span className="text-brand-primary font-mono">{percentageSpent.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-brand-primary h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${Math.min(percentageSpent, 100)}%` }} 
                    ></div>
                </div>
            </div>
        </Card>
    );
}

export default MonthSummaryCard;
