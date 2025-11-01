import React, { useState, useEffect, useMemo } from 'react';
import { useCrud } from '../hooks/useCrud';
import PageTitle from '../components/ui/PageTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Checkbox from '../components/ui/Checkbox';

function MonthlyPlanningPage() {
    const { items: planningEntries, loading, error, addItem, updateItem, deleteMultipleItems, fetchItems } = useCrud('/monthly-planning');
    const [formData, setFormData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        categoryId: '',
        estimatedAmount: ''
    });
    const { items: categories } = useCrud('/categories');
    const [editingEntry, setEditingEntry] = useState(null);
    const [selectedPlanningEntries, setSelectedPlanningEntries] = useState(new Set());

    const handleDeleteSelected = async () => {
        await deleteMultipleItems(Array.from(selectedPlanningEntries));
        setSelectedPlanningEntries(new Set());
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const planningData = {
            month: parseInt(formData.month),
            year: parseInt(formData.year),
            category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null,
            estimatedAmount: parseFloat(formData.estimatedAmount)
        };

        if (editingEntry) {
            await updateItem(editingEntry.id, planningData);
        } else {
            await addItem(planningData);
        }
        resetForm();
        fetchItems(); // Refresh list after add/update
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setFormData({
            month: entry.month,
            year: entry.year,
            categoryId: entry.category?.id || '',
            estimatedAmount: entry.estimatedAmount
        });
    };

    const resetForm = () => {
        setEditingEntry(null);
        setFormData({
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            categoryId: '',
            estimatedAmount: ''
        });
    };

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    const getMonthName = (monthNumber) => {
        const month = months.find(m => m.value === monthNumber);
        return month ? month.label : '';
    };

    return (
        <div className="container mx-auto">

            <PageTitle>Monthly Planning</PageTitle>

            {selectedPlanningEntries.size > 0 && (
                <div className="mb-4">
                    <Button 
                        variant="danger"
                        onClick={handleDeleteSelected}>
                        Delete Selected ({selectedPlanningEntries.size})
                    </Button>
                </div>
            )}
    
            <Card as="form" onSubmit={handleSubmit} className="mb-8 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Select name="month" label="Month" value={formData.month} onChange={handleChange} required>
                            {months.map(month => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Input name="year" label="Year" type="number" value={formData.year} onChange={handleChange} required />
                    </div>
                    <div>
                        <Select name="categoryId" label="Category" value={formData.categoryId} onChange={handleChange}>
                            <option value="">Select Category (Optional)</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Input name="estimatedAmount" label="Estimated Amount" type="number" step="0.01" value={formData.estimatedAmount} onChange={handleChange} placeholder="0.00" required />
                    </div>
                    <div className="flex items-end gap-2 md:col-span-4">
                        <Button type="submit" variant="primary" className="w-full">
                            {editingEntry ? 'Update Planning' : 'Save Planning'}
                        </Button>
                        {editingEntry && (
                            <Button onClick={resetForm} type="button" variant="ghost" className="w-full">
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {loading ? (
                <Spinner />
            ) : error ? (
                <ErrorMessage message={error.message} />
            ) : (
                <div className="space-y-3">
                    {planningEntries.length > 0 ? (
                        <>
                            <Card className="mb-4 p-4">
                                <div className="flex items-center">
                                    <Checkbox 
                                        id="selectAllPlanningEntries"
                                        checked={isAllSelected} 
                                        onChange={handleSelectAll} 
                                        label="Select All"
                                    />
                                </div>
                            </Card>
                            {planningEntries.map(entry => (
                                <Card key={entry.id} className={`flex justify-between items-center p-3 ${selectedPlanningEntries.has(entry.id) ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                                    <div className="flex items-center">
                                        <Checkbox 
                                            id={`planningEntry-${entry.id}`}
                                            checked={selectedPlanningEntries.has(entry.id)} 
                                            onChange={() => handleSelect(entry.id)} 
                                        />
                                        <span className="font-semibold dark:text-gray-200 ml-2">{getMonthName(entry.month)} {entry.year} - {entry.category?.name || 'General'}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.estimatedAmount)}
                                        </span>
                                        <div className="flex space-x-2">
                                            <Button onClick={() => handleEdit(entry)} variant="warning" size="sm">Edit</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </>
                    ) : (
                        <Card className="text-center p-6">
                            <p className="text-gray-500 dark:text-gray-400">No planning entries found. Add one using the form above.</p>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

export default MonthlyPlanningPage;