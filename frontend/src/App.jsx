import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage.jsx';
// Importe as outras páginas quando as criar

function App() {
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <Link to="/" className="mr-4">Dashboard</Link>
        <Link to="/transactions" className="mr-4">Transactions</Link>
        <Link to="/accounts" className="mr-4">Accounts</Link>
        <Link to="/categories" className="mr-4">Categories</Link>
      </nav>

      <main className="p-4">
        <Routes>
          {/* <Route path="/" element={<DashboardPage />} /> */}
          {/* <Route path="/accounts" element={<AccountsPage />} /> */}
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;