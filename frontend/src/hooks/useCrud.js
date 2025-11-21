import { useState, useCallback } from 'react';
import api from '../services/api';

export function useCrud(endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.get(endpoint, { params });
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(`Failed to fetch ${endpoint}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const addItem = useCallback(async (itemData) => {
    try {
      const response = await api.post(endpoint, itemData);
      setItems(prevItems => [...prevItems, response.data]);
      setError(null);
      return null; // Success
    } catch (err) {
      console.error(`Error adding item to ${endpoint}:`, err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add item.';
      setError(errorMessage);
      return errorMessage; // Return error message
    }
  }, [endpoint]);

  const updateItem = useCallback(async (id, itemData) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, itemData);
      setItems(prevItems => prevItems.map(item => item.id === id ? response.data : item));
      setError(null);
      return null; // Success
    } catch (err) {
      console.error(`Error updating item in ${endpoint}:`, err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update item.';
      setError(errorMessage);
      return errorMessage; // Return error message
    }
  }, [endpoint]);

  const deleteItem = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`${endpoint}/${id}`);
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        setError(null);
        return null; // Success
      } catch (err) {
        console.error(`Error deleting item from ${endpoint}:`, err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete item.';
        setError(errorMessage);
        return errorMessage; // Return error message
      }
    }
    return null;
  }, [endpoint]);

  const deleteMultipleItems = useCallback(async (ids) => {
    console.log('Attempting to delete items with IDs:', ids);
    if (window.confirm(`Are you sure you want to delete ${ids.length} items?`)) {
      try {
        const response = await api.post(`${endpoint}/delete-multiple`, ids);
        console.log('Deletion response:', response);
        setItems(prevItems => prevItems.filter(item => !ids.includes(item.id)));
        return null;
      } catch (err) {
        console.error(`Error deleting items from ${endpoint}:`, err);
        if (err.response) {
          console.error('Error response:', err.response);
        }
        return err;
      }
    }
    return null;
  }, [endpoint]);

  return { items, loading, error, addItem, updateItem, deleteItem, deleteMultipleItems, fetchItems };
}
