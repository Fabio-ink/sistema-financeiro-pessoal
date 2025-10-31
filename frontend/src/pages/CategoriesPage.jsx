import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PageTitle from '../components/PageTitle';
import Card from '../components/Card';
import Button from '../components/Button';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { name };

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, categoryData);
      } else {
        await api.post('/categories', categoryData);
      }
      setName('');
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
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

      <div className="space-y-3">
        {categories.map(cat => (
          <Card key={cat.id} className="flex justify-between items-center p-3">
            <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.name}</span>
            <div className="flex space-x-2">
              <Button onClick={() => handleEdit(cat)} variant="warning" size="sm">Edit</Button>
              <Button onClick={() => handleDelete(cat.id)} variant="danger" size="sm">Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;