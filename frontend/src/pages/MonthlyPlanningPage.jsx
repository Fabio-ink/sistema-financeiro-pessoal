import React, { useState, useEffect, useMemo } from 'react';
import { useCrud } from '../hooks/useCrud';
import PageTitle from '../components/ui/PageTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Checkbox from '../components/ui/Checkbox';
import MonthlyPlanningFormModal from '../components/MonthlyPlanningFormModal';
import MonthlyPlanningFilterModal from '../components/MonthlyPlanningFilterModal';
import { Plus, Filter, Trash2 } from 'lucide-react';

function MonthlyPlanningPage({ categories }) {
    const { items: planningEntries, loading, error, addItem, updateItem, deleteMultipleItems, fetchItems } = useCrud('/monthly-planning');
    
    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);

    // Filter state
    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        category: ''
    });

    const filteredEntries = planningEntries.filter(entry => {
        const matchMonth = filters.month ? entry.month === parseInt(filters.month) : true;
        const matchYear = filters.year ? entry.year === parseInt(filters.year) : true;
        const matchCategory = filters.category ? entry.category?.id === parseInt(filters.category) : true;
        return matchMonth && matchYear && matchCategory;
    });

    const [selectedPlanningEntries, setSelectedPlanningEntries] = useState(new Set());

    const handleDeleteSelected = async () => {
        if (window.confirm(`Tem certeza que deseja excluir ${selectedPlanningEntries.size} itens?`)) {
            await deleteMultipleItems(Array.from(selectedPlanningEntries));
            setSelectedPlanningEntries(new Set());
        }
    };

    const handleSelect = (entryId) => {
        setSelectedPlanningEntries(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(entryId)) {
                newSelected.delete(entryId);
            } else {
                newSelected.add(entryId);
            }
            return newSelected;
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedPlanningEntries(new Set(planningEntries.map(t => t.id)));
        } else {
            setSelectedPlanningEntries(new Set());
        }
    };

    const isAllSelected = useMemo(() => 
        planningEntries.length > 0 && selectedPlanningEntries.size === planningEntries.length,
        [selectedPlanningEntries.size, planningEntries.length]
    );

    useEffect(() => {
        fetchItems(); // Fetch planning entries on mount
    }, [fetchItems]);

    const handleOpenCreateModal = () => {
        setEditingEntry(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (entry) => {
        setEditingEntry(entry);
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (formData) => {
        const planningData = {
            month: parseInt(formData.month),
            year: parseInt(formData.year),
            category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null,
            estimatedAmount: parseFloat(formData.estimatedAmount)
        };

        let resultError = null;
        if (editingEntry) {
            resultError = await updateItem(editingEntry.id, planningData);
        } else {
            resultError = await addItem(planningData);
        }

        if (!resultError) {
            setIsFormModalOpen(false);
            fetchItems(); // Refresh list after add/update
        }
    };

    const months = [
        { value: 1, label: 'Janeiro' },
        { value: 2, label: 'Fevereiro' },
        { value: 3, label: 'Março' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Maio' },
        { value: 6, label: 'Junho' },
        { value: 7, label: 'Julho' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Setembro' },
        { value: 10, label: 'Outubro' },
        { value: 11, label: 'Novembro' },
        { value: 12, label: 'Dezembro' },
    ];

    const getMonthName = (monthNumber) => {
        const month = months.find(m => m.value === monthNumber);
        return month ? month.label : '';
    };

    return (
        <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <PageTitle>Planejamento Mensal</PageTitle>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsFilterModalOpen(true)}
                        className="flex items-center gap-2 flex-1 md:flex-none justify-center"
                    >
                        <Filter size={18} />
                        Filtrar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 flex-1 md:flex-none justify-center shadow-lg shadow-brand-primary/20"
                    >
                        <Plus size={18} />
                        Novo Planejamento
                    </Button>
                </div>
            </div>

            {selectedPlanningEntries.size > 0 && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
                        <span className="text-red-200 font-medium pl-2">
                            {selectedPlanningEntries.size} item(s) selecionado(s)
                        </span>
                        <Button 
                            variant="danger"
                            size="sm"
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2"
                        >
                            <Trash2 size={16} />
                            Excluir Selecionados
                        </Button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : error ? (
                <ErrorMessage message={typeof error === 'string' ? error : error.message || 'An error occurred'} />
            ) : (
                <div className="space-y-4">
                    {planningEntries.length > 0 && (
                        <div className="flex items-center justify-end px-2 mb-2">
                            <Checkbox 
                                id="selectAllPlanningEntries"
                                checked={isAllSelected} 
                                onChange={handleSelectAll} 
                                label="Selecionar Todos"
                            />
                        </div>
                    )}

                    {filteredEntries.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredEntries.map(entry => {
                                const spent = entry.spentAmount || 0;
                                const planned = entry.estimatedAmount || 0;
                                const remaining = planned - spent;
                                const percentage = planned > 0 ? (spent / planned) * 100 : 0;
                                const isOverBudget = spent > planned;

                                return (
                                <Card key={entry.id} className={`group transition-all duration-200 hover:border-brand-primary/30 ${selectedPlanningEntries.has(entry.id) ? 'bg-brand-primary/5 border-brand-primary/30' : ''}`}>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <Checkbox 
                                                    id={`planningEntry-${entry.id}`}
                                                    checked={selectedPlanningEntries.has(entry.id)} 
                                                    onChange={() => handleSelect(entry.id)} 
                                                />
                                                <div>
                                                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                                        {entry.category?.name || 'Geral'}
                                                        <span className="text-xs font-normal text-gray-400 bg-brand-surface-light px-2 py-0.5 rounded-full border border-brand-border">
                                                            {getMonthName(entry.month)} {entry.year}
                                                        </span>
                                                    </h3>
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={() => handleOpenEditModal(entry)} 
                                                variant="ghost" 
                                                size="sm"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Editar
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-8 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Gasto</p>
                                                <p className={`font-mono font-bold text-lg ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(spent)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Planejado</p>
                                                <p className="font-mono font-bold text-lg text-white">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(planned)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Restante</p>
                                                <p className={`font-mono font-bold text-lg ${remaining < 0 ? 'text-red-400' : 'text-brand-success'}`}>
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(remaining)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative pt-2">
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="text-gray-400 font-medium">Progresso</span>
                                                <span className={`font-mono font-bold ${isOverBudget ? 'text-red-400' : 'text-brand-primary'}`}>
                                                    {percentage.toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-brand-surface-light rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-500 ease-out ${isOverBudget ? 'bg-red-500' : 'bg-brand-primary'}`} 
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-brand-surface/50 rounded-2xl border border-dashed border-brand-border">
                            <div className="bg-brand-surface-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="text-gray-400" size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">Nenhum planejamento encontrado</h3>
                            <p className="text-gray-400 max-w-sm mx-auto">
                                Não encontramos nenhum registro com os filtros atuais. Tente limpar os filtros ou criar um novo planejamento.
                            </p>
                        </div>
                    )}
                </div>
            )}

            <MonthlyPlanningFormModal 
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingEntry}
                categories={categories}
            />

            <MonthlyPlanningFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
                categories={categories}
            />
        </div>
    );
}

export default MonthlyPlanningPage;