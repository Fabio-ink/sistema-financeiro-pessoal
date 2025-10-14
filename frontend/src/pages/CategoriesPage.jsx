import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-md bg-white">
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Food, Investment"
              className="mt-1 border p-2 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded h-10">
            {editingCategory ? 'Update' : 'Save'}
          </button>
          {editingCategory && (
            <button onClick={cancelEdit} type="button" className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded h-10">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="flex justify-between items-center p-3 border rounded shadow-sm bg-white">
            <span className="font-semibold text-gray-800">{cat.name}</span>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(cat)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded">Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;