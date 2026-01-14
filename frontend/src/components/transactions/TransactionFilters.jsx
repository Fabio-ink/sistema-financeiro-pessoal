import React from 'react';
import Card from '../ui/Card';
import PageTitle from '../ui/PageTitle';
import Input from '../ui/Input';
import DatePicker from '../ui/DatePicker';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TransactionFilters = ({ filters, onChange, onClear, categories }) => {
    return (
        <Card className="mb-4 p-4 bg-brand-card/80 backdrop-blur-sm border border-brand-border/30">
            <div className="flex justify-between items-center mb-4">
                <PageTitle level={3} className="text-lg font-semibold text-white">Filtrar Transações</PageTitle>
                <Button 
                    onClick={onClear}
                    className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 hover:border-brand-primary/50 text-xs px-3 py-1 h-8 uppercase tracking-wider font-bold transition-all"
                >
                    Limpar Filtros
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <Input 
                    label="Nome"
                    type="text"
                    value={filters.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="Filtrar por nome"
                />
                <DatePicker 
                    label="Data Início"
                    value={filters.startDate}
                    onChange={(e) => onChange('startDate', e.target.value)}
                />
                <DatePicker 
                    label="Data Fim"
                    value={filters.endDate}
                    onChange={(e) => onChange('endDate', e.target.value)}
                />
                <Select
                    label="Categoria"
                    value={filters.categoryId}
                    onChange={(e) => onChange('categoryId', e.target.value)}
                >
                    <option value="">Todas as Categorias</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </Select>
                <Select
                    label="Tipo"
                    value={filters.transactionType}
                    onChange={(e) => onChange('transactionType', e.target.value)}
                >
                    <option value="">Todos os Tipos</option>
                    <option value="ENTRADA">Receita</option>
                    <option value="SAIDA">Despesa</option>
                    <option value="MOVIMENTACAO">Transferência</option>
                    <option value="CARTAO">Cartão de Crédito</option>
                </Select>
            </div>
        </Card>
    );
};

export default TransactionFilters;
