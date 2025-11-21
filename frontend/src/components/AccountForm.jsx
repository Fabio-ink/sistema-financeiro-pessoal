import React, { useState, useEffect } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import { createAccount, updateAccount } from '../services/api';

function AccountForm({ account, onSave, onCancel, onDelete }) {
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setName(account.name);
      setInitialBalance(account.initialBalance);
    } else {
      setName('');
      setInitialBalance('');
    }
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accountData = {
        name,
        initialBalance: parseFloat(initialBalance),
      };

      if (account && account.id) {
        await updateAccount(account.id, accountData);
      } else {
        await createAccount(accountData);
      }
      onSave();
    } catch (error) {
      console.error("Error saving account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
        setLoading(true);
        try {
            await onDelete(account.id);
        } catch (error) {
            console.error("Error deleting account:", error);
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Nome da Conta" 
        type="text" 
        placeholder="Ex: Conta Corrente" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input 
        label="Saldo Inicial" 
        type="number" 
        step="0.01" 
        placeholder="0.00" 
        value={initialBalance}
        onChange={(e) => setInitialBalance(e.target.value)}
        required
      />
      <div className="flex justify-between items-center mt-6">
        {account && (
            <Button 
                variant="danger" 
                type="button" 
                onClick={handleDelete} 
                disabled={loading}
            >
                Excluir
            </Button>
        )}
        <div className={`flex gap-2 ${!account ? 'w-full justify-end' : ''}`}>
            <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Salvando...' : (account ? 'Atualizar Conta' : 'Salvar Conta')}
            </Button>
        </div>
      </div>
    </form>
  );
}

export default AccountForm;
