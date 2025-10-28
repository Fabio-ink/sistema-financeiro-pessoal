import React, { useContext } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { ThemeContext } from './contexts/ThemeContext';
import ThemeSwitcher from './components/ThemeSwitcher';

// Importa as páginas
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage'; 
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  const { theme } = useContext(ThemeContext);
  const activeLinkStyle = {
    color: '#3b82f6', // blue-500
    borderBottom: '2px solid #3b82f6',
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 min-h-screen font-sans">
        
        {/* NAVEGAÇÃO ESTILIZADA */}
        <nav className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="text-xl font-bold text-gray-900 dark:text-white">MyFinances</div>
              <div className="flex items-center space-x-8 text-gray-600 dark:text-gray-400">
                <NavLink to="/" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
                <NavLink to="/transactions" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Transactions</NavLink>
                <NavLink to="/accounts" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Accounts</NavLink>
                <NavLink to="/categories" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Categories</NavLink>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </nav>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;