import React, { useState, useMemo } from 'react';
import { useCrud } from '../hooks/useCrud';
import PageTitle from '../components/ui/PageTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

function CategoriesPage() {
  const { items: categories, loading, error, addItem, updateItem, deleteMultipleItems } = useCrud('/categories');
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { name };

    if (editingCategory) {
      await updateItem(editingCategory.id, categoryData);
    } else {
      await addItem(categoryData);
    }

    setName('');
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  const handleDeleteSelected = async () => {
    await deleteMultipleItems(Array.from(selectedCategories));
    setSelectedCategories(new Set());
  };

  const handleSelect = (categoryId) => {
    setSelectedCategories(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(categoryId)) {
            newSelected.delete(categoryId);
        } else {
            newSelected.add(categoryId);
        }
        return newSelected;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
        setSelectedCategories(new Set(categories.map(c => c.id)));
    } else {
        setSelectedCategories(new Set());
    }
  };

  const isAllSelected = useMemo(() => 
    categories.length > 0 && selectedCategories.size === categories.length,
    [selectedCategories.size, categories.length]
  );

  const cancelEdit = () => {
    setEditingCategory(null);
    setName('');
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Manage Categories</PageTitle>
        {selectedCategories.size > 0 && (
            <Button 
                variant="danger"
                onClick={handleDeleteSelected}>
                Delete Selected ({selectedCategories.size})
            </Button>
        )}
      </div>

      <Card as="form" onSubmit={handleSubmit} className="mb-8 p-4">
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Food, Investment"
              className="mt-1 border p-2 rounded-lg w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="h-10">
            {editingCategory ? 'Update' : 'Save'}
          </Button>
          {editingCategory && (
            <Button onClick={cancelEdit} type="button" variant="ghost" className="h-10">
              Cancel
            </Button>
          )}
        </div>
      </Card>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="space-y-3">
          {categories.length > 0 ? (
            <>
                <div className="flex items-center p-3">
                    <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="mr-4"/>
                    <span>Select All</span>
                </div>
                {categories.map(cat => (
                  <Card key={cat.id} className={`flex justify-between items-center p-3 ${selectedCategories.has(cat.id) ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                    <div class="flex items-center">
                        <input type="checkbox" checked={selectedCategories.has(cat.id)} onChange={() => handleSelect(cat.id)} className="mr-4"/>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleEdit(cat)} variant="warning" size="sm">Edit</Button>
                    </div>
                  </Card>
                ))}
            </>
          ) : (
            <Card className="text-center p-6">
              <p className="text-gray-500 dark:text-gray-400">No categories found. Add one using the form above.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;