import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { LogOut, User, Settings } from 'lucide-react';

// Hook para detectar clique fora
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef();

  useOnClickOutside(ref, () => setIsOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/logout-success');
  };

  const getInitials = () => {
    if (user?.name) return user.name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    if (user?.sub) return user.sub[0].toUpperCase();
    return <User size={20} />;
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-semibold"
      >
        {getInitials()}
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-brand-card border border-brand-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-brand-border">
            <p className="font-semibold text-white truncate">{user?.name || 'Usuário'}</p>
            <p className="text-sm text-gray-400 truncate">{user?.email || user?.sub}</p>
          </div>
          <nav className="flex flex-col p-2">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-brand-secondary text-gray-300 w-full text-left"
            >
              <User size={16} /> Meus Dados
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-2 rounded-md hover:bg-brand-secondary text-brand-red w-full text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
export default UserMenu;