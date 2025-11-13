import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, PageTitle, Input, Button } from '../components/ui';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-8 max-w-md w-full">
        <PageTitle>Login</PageTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button variant="primary" type="submit" className="w-full">
            Login
          </Button>
        </form>
        <p className="text-center mt-4">
          Não tem uma conta?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Cadastre-se
          </a>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
