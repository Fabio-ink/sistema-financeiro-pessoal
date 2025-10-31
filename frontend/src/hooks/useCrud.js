import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useCrud(endpoint) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoint);
      setItems(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError(`Failed to fetch ${endpoint}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (itemData) => {
    try {
      const response = await api.post(endpoint, itemData);
      setItems(prevItems => [...prevItems, response.data]);
      return null;
    } catch (err) {
      console.error(`Error adding item to ${endpoint}:`, err);
      return err;
    }
  }, [endpoint]);

  const updateItem = useCallback(async (id, itemData) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, itemData);
      setItems(prevItems => prevItems.map(item => item.id === id ? response.data : item));
      return null;
    } catch (err) {
      console.error(`Error updating item in ${endpoint}:`, err);
      return err;
    }
  }, [endpoint]);

  const deleteItem = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`${endpoint}/${id}`);
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        return null;
      } catch (err) {
        console.error(`Error deleting item from ${endpoint}:`, err);
        return err;
      }
    }
    return null;
  }, [endpoint]);

  return { items, loading, error, addItem, updateItem, deleteItem, fetchItems };
}
