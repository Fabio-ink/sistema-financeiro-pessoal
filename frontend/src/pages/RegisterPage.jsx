import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, PageTitle, Input, Button } from '../components/ui';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/login');
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-8 max-w-md w-full">
        <PageTitle>Register</PageTitle>
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
            Register
          </Button>
        </form>
        <p className="text-center mt-4">
          Já tem uma conta?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
