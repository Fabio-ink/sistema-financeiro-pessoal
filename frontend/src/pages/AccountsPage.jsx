import React, { useState, useMemo, useEffect } from 'react';
import { useCrud } from '../hooks/useCrud';
import PageTitle from '../components/ui/PageTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/ui/Input';
import Checkbox from '../components/ui/Checkbox';

function AccountsPage() {
  const { items: accounts, loading, error, addItem, updateItem, deleteMultipleItems, fetchItems } = useCrud('/accounts');
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState(new Set());

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accountData = { name, initialBalance: parseFloat(initialBalance) };

    if (editingAccount) {
      await updateItem(editingAccount.id, accountData);
    } else {
      await addItem(accountData);
    }
    
    setName('');
    setInitialBalance('');
    setEditingAccount(null);
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setName(account.name);
    setInitialBalance(account.initialBalance);
  };

  const handleDeleteSelected = async () => {
    await deleteMultipleItems(Array.from(selectedAccounts));
    setSelectedAccounts(new Set());
  };

  const handleSelect = (accountId) => {
    setSelectedAccounts(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(accountId)) {
            newSelected.delete(accountId);
        } else {
            newSelected.add(accountId);
        }
        return newSelected;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
        setSelectedAccounts(new Set(accounts.map(a => a.id)));
    } else {
        setSelectedAccounts(new Set());
    }
  };

  const isAllSelected = useMemo(() => 
    accounts.length > 0 && selectedAccounts.size === accounts.length,
    [selectedAccounts.size, accounts.length]
  );
  
  const cancelEdit = () => {
    setEditingAccount(null);
    setName('');
    setInitialBalance('');
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <PageTitle>Manage Accounts</PageTitle>
        {selectedAccounts.size > 0 && (
            <Button 
                variant="danger"
                onClick={handleDeleteSelected}>
                Delete Selected ({selectedAccounts.size})
            </Button>
        )}
      </div>

      <Card as="form" onSubmit={handleSubmit} className="mb-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input id="acc-name" label="Account Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Inter, XP" required />
          </div>
          <div>
            <Input id="acc-balance" label="Initial Balance" type="number" step="0.01" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} placeholder="0.00" required />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" variant="primary" className="w-full">
              {editingAccount ? 'Update' : 'Save'}
            </Button>
            {editingAccount && (
              <Button onClick={cancelEdit} type="button" variant="ghost" className="w-full">
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="space-y-3">
            {accounts.length > 0 ? (
                <>
                    <div className="flex items-center p-3">
                        <Checkbox id="selectAllAccounts" checked={isAllSelected} onChange={handleSelectAll} label="Select All"/>
                    </div>
                    {accounts.map(account => (
                        <Card key={account.id} className={`flex justify-between items-center p-3 ${selectedAccounts.has(account.id) ? 'bg-blue-100 dark:bg-blue-900' : ''}`}>
                            <div className="flex items-center">
                                <Checkbox id={`account-${account.id}`} checked={selectedAccounts.has(account.id)} onChange={() => handleSelect(account.id)} />
                                <span className="font-semibold dark:text-gray-200 ml-2">{account.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700 dark:text-gray-300">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.currentBalance)}
                                </span>
                                <div className="flex space-x-2">
                                    <Button onClick={() => handleEdit(account)} variant="warning" size="sm">Edit</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </>
          ) : (
            <Card className="text-center p-6">
              <p className="text-gray-500 dark:text-gray-400">No accounts found. Add one using the form above.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountsPage;