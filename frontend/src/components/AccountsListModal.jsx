import React from 'react';
import Button from './ui/Button';
import { Edit2 } from 'lucide-react';

function AccountsListModal({ accounts, onEdit, onClose }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div 
              key={account.id} 
              className="flex justify-between items-center p-4 rounded-xl bg-brand-dark/30 border border-brand-border/20 hover:border-brand-border/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-brand-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-200 group-hover:text-white transition-colors">{account.name}</p>
                  <p className="text-xs text-text-secondary">Saldo Inicial: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.initialBalance)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-gray-300 font-mono font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.currentBalance)}
                </p>
                <button 
                  onClick={() => onEdit(account)}
                  className="p-2 rounded-lg hover:bg-brand-primary/20 text-text-secondary hover:text-brand-primary transition-colors"
                  title="Editar Conta"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">Nenhuma conta cadastrada.</p>
        )}
      </div>
      <div className="flex justify-end pt-4 border-t border-brand-border/30">
        <Button variant="outline" onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
}

export default AccountsListModal;
