import React from 'react';
import { Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PieChart } from 'lucide-react';

import DashboardPage from './src/pages/DashboardPage.jsx';
import AccountsPage from './src/pages/AccountsPage.jsx';
import CategoriesPage from './src/pages/CategoriesPage.jsx';
import TransactionsPage from './src/pages/TransactionsPage.jsx';
import LoginPage from './src/pages/LoginPage.jsx';
import RegisterPage from './src/pages/RegisterPage.jsx';
import ForgotPasswordPage from './src/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './src/pages/ResetPasswordPage.jsx';
import LogoutSuccessPage from './src/pages/LogoutSuccessPage.jsx';
import ProtectedRoute from './src/components/ProtectedRoute.jsx';
import UserMenu from './src/components/UserMenu.jsx';
import UserProfilePage from './src/pages/UserProfilePage.jsx';

const AppLayout = () => (
  <div className="min-h-screen flex bg-brand-dark text-text-primary font-sans">
    <nav className="w-72 bg-brand-card/50 border-r border-brand-border/30 p-6 flex flex-col backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
        </div>
        <div className="text-2xl font-bold tracking-tight">SyncWallet</div>
      </div>
      
      <div className="flex flex-col gap-2">
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 font-semibold' : 'text-text-secondary hover:bg-brand-card-hover hover:text-white'}`}>
          <LayoutDashboard size={22} /> Dashboard
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => `flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 font-semibold' : 'text-text-secondary hover:bg-brand-card-hover hover:text-white'}`}>
          <PieChart size={22} /> Categorias
        </NavLink>
      </div>

      <div className="mt-auto pt-8 border-t border-brand-border/30">
        <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-info flex items-center justify-center text-white font-bold">
                F
            </div>
            <div>
                <p className="text-sm font-semibold text-white">Fabio Prada</p>
                <p className="text-xs text-text-secondary">Premium Plan</p>
            </div>
        </div>
      </div>
    </nav>
    <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/5 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-info/5 rounded-full blur-[150px]"></div>
        </div>

      <header className="flex-shrink-0 h-20 flex items-center justify-between px-8 z-20">
        <h1 className="text-xl font-semibold text-white">Visão Geral</h1>
        <UserMenu />
      </header>
      <main className="flex-1 p-8 overflow-auto z-10 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/logout-success" element={<LogoutSuccessPage />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;