import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null); // Stores the object being edited

  // Function to fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // useEffect to fetch data when the component loads
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryData = { name };

    try {
      if (editing) {
        // Update existing category
        await api.put(`/categories/${editing.id}`, categoryData);
      } else {
        // Create new category
        await api.post('/categories', categoryData);
      }
      // Clear form and reload list
      setName('');
      setEditing(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };
  
  const handleEdit = (category) => {
    setEditing(category);
    setName(category.name);
  };
  
  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
          {editing ? 'Update' : 'Save'}
        </button>
        {editing && (
          <button onClick={() => { setEditing(null); setName(''); }} className="mt-2 ml-2 bg-gray-500 text-white p-2 rounded">
            Cancel Edit
          </button>
        )}
      </form>
      
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="flex justify-between items-center p-2 border rounded">
            <span>{cat.name}</span>
            <div>
              <button onClick={() => handleEdit(cat)} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(cat.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;
