import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, PageTitle } from '../components/ui';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Failed to login', error);
      setError('Email ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-brand-dark opacity-80"></div> {/* Overlay escuro */}
      
      <div className="relative z-10 w-full max-w-md p-8 space-y-6">
        <PageTitle className="text-center text-4xl text-white">Login</PageTitle>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="Email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-brand-primary hover:underline">
              Esqueci minha senha
            </Link>
          </div>

          <Button variant="primary" type="submit" className="w-full py-3!">
            Entrar
          </Button>
        </form>
        <p className="text-center text-gray-300">
          Não tem uma conta?{' '}
          <Link to="/register" className="font-semibold text-brand-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;