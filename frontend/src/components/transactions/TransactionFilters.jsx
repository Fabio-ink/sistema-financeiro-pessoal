import React from 'react';
import Card from '../ui/Card';
import PageTitle from '../ui/PageTitle';
import Input from '../ui/Input';
import DatePicker from '../ui/DatePicker';
import Select from '../ui/Select';
import Button from '../ui/Button';

const TransactionFilters = ({ filters, onChange, onApply, onClear, categories }) => {
    return (
        <Card className="mb-6 p-4">
            <PageTitle level={3} className="mb-4">Filtrar Transações</PageTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={onClear}>Limpar Filtros</Button>
                <Button variant="primary" onClick={onApply}>Aplicar Filtros</Button>
            </div>
        </Card>
    );
};

export default TransactionFilters;
