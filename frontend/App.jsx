import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LayoutDashboard, List, Wallet, PieChart } from 'lucide-react';

import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutSuccessPage from './pages/LogoutSuccessPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserMenu from './components/UserMenu';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const showLayout = isAuthenticated && 
                     location.pathname !== '/login' && 
                     location.pathname !== '/register' &&
                     location.pathname !== '/logout-success';

  return (
    <div className="text-gray-300 min-h-screen font-sans flex">
      
      {/* BARRA LATERAL (Sidebar) */}
      {showLayout && (
        <nav className="w-64 bg-brand-card border-r border-brand-border p-4 flex flex-col">
          <div className="text-2xl font-bold text-white mb-10 pl-2">SYNC wallet</div>
          <div className="flex flex-col gap-2">
            <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-brand-primary text-white' : 'hover:bg-brand-secondary'}`}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-brand-primary text-white' : 'hover:bg-brand-secondary'}`}>
              <List size={20} /> Transações
            </NavLink>
            <NavLink to="/accounts" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-brand-primary text-white' : 'hover:bg-brand-secondary'}`}>
              <Wallet size={20} /> Contas
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-brand-primary text-white' : 'hover:bg-brand-secondary'}`}>
              <PieChart size={20} /> Categorias
            </NavLink>
          </div>
          <div className="mt-auto">
            {/* O UserMenu será movido para o Header na próxima etapa, mas por enquanto fica aqui ou no header */}
          </div>
        </nav>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col">
        {showLayout && (
          <header className="shrink-0 bg-brand-card h-16 border-b border-brand-border flex items-center justify-end p-4">
             {/* O conteúdo (ex: Título da Página) pode ir aqui, ou apenas o UserMenu */}
             <UserMenu />
          </header>
        )}

        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout-success" element={<LogoutSuccessPage />} /> {/* Rota para a nova página */}
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;