import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, PageTitle } from '../components/ui';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Se o email estiver cadastrado, você receberá um código de recuperação.');
      setTimeout(() => navigate('/reset-password'), 3000);
    } catch (err) {
      setError('Erro ao processar solicitação. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-brand-dark opacity-80"></div>
      
      <div className="relative z-10 w-full max-w-md p-8 space-y-6">
        <PageTitle className="text-center text-3xl text-white">Recuperar Senha</PageTitle>
        
        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-md text-sm text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <p className="text-gray-300 text-center text-sm">
          Digite seu email para receber um código de recuperação.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            placeholder="Email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Button variant="primary" type="submit" className="w-full py-3!" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Código'}
          </Button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm text-brand-primary hover:underline">
            Voltar para Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
