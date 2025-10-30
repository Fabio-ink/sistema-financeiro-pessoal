import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [editingAccount, setEditingAccount] = useState(null);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accountData = { name, initialBalance: parseFloat(initialBalance) };

    try {
      if (editingAccount) {
        await api.put(`/accounts/${editingAccount.id}`, accountData);
      } else {
        await api.post('/accounts', accountData);
      }
      setName('');
      setInitialBalance('');
      setEditingAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error("Error saving account:", error);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setName(account.name);
    setInitialBalance(account.initialBalance);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await api.delete(`/accounts/${id}`);
        fetchAccounts();
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };
  
  const cancelEdit = () => {
    setEditingAccount(null);
    setName('');
    setInitialBalance('');
  };

  return (
    <div className="container mx-auto">
      <h1 class="text-3xl font-bold mb-6 dark:text-white">Manage Accounts</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="acc-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
            <input id="acc-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Inter, XP" className="mt-1 border p-2 rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
          </div>
          <div>
            <label htmlFor="acc-balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Balance</label>
            <input id="acc-balance" type="number" step="0.01" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} placeholder="0.00" className="mt-1 border p-2 rounded-lg w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg w-full">
              {editingAccount ? 'Update' : 'Save'}
            </button>
            {editingAccount && (
              <button onClick={cancelEdit} type="button" className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg w-full">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="space-y-3">
        {accounts.map(account => (
          <div key={account.id} className="flex justify-between items-center p-3 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
            <div>
              <span className="font-semibold dark:text-gray-200">{account.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.initialBalance)}
              </span>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(account)} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg">Edit</button>
                <button onClick={() => handleDelete(account.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountsPage;