import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

function LogoutSuccessPage() {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center min-h-screen bg-brand-dark">
            <div className="relative z-10 flex flex-col items-center text-white space-y-8">
                <h1 className="text-5xl font-bold">
                    Logout Realizado com Sucesso
                </h1>
                <Button 
                    variant="outline" 
                    className="text-lg! py-3! px-8! border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                    onClick={() => navigate('/login')}
                >
                    Entrar Novamente
                </Button>
            </div>
        </div>
    );
}

export default LogoutSuccessPage;