import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

// Importa as páginas
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import CategoriesPage from './pages/CategoriesPage';
import TransactionsPage from './pages/TransactionsPage'; 
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  const activeLinkStyle = {
    color: '#3b82f6', // blue-500
    borderBottom: '2px solid #3b82f6',
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">MyFinances</div>
            <div className="flex items-center">
              <div className="flex items-center space-x-8 h-full text-gray-600 dark:text-gray-300">
                <NavLink to="/" className="h-full flex items-center" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
                <NavLink to="/transactions" className="h-full flex items-center" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Transactions</NavLink>
                <NavLink to="/accounts" className="h-full flex items-center" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Accounts</NavLink>
                <NavLink to="/categories" className="h-full flex items-center" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Categories</NavLink>
              </div>
              <div className="ml-4">
                <ThemeToggleButton />
              </div>
            </div>
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