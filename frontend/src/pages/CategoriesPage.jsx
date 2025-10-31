import React, { useState } from 'react';
import { useCrud } from '../hooks/useCrud';
import PageTitle from '../components/ui/PageTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

function CategoriesPage() {
  const { items: categories, loading, error, addItem, updateItem, deleteItem } = useCrud('/categories');
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

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

  const handleDelete = async (id) => {
    await deleteItem(id);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setName('');
  };

  return (
    <div className="container mx-auto">
      <PageTitle>Manage Categories</PageTitle>

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
            categories.map(cat => (
              <Card key={cat.id} className="flex justify-between items-center p-3">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.name}</span>
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(cat)} variant="warning" size="sm">Edit</Button>
                  <Button onClick={() => handleDelete(cat.id)} variant="danger" size="sm">Delete</Button>
                </div>
              </Card>
            ))
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