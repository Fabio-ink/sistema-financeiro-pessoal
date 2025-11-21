import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PageTitle, Card, Input, Button } from '../components/ui';
import api from '../services/api';
import { User, Mail, Lock } from 'lucide-react';

const UserProfilePage = () => {
  const { user, updateUserToken } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || user.sub || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/me', { name });
      if (data.token) {
        updateUserToken(data.token);
      }
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
        setPasswordError("As novas senhas não coincidem.");
        return;
    }

    setLoading(true);
    try {
        await api.post('/users/change-password', { currentPassword, newPassword });
        alert('Senha alterada com sucesso!');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (error) {
        console.error("Error changing password", error);
        setPasswordError(error.response?.data || "Erro ao alterar senha.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <PageTitle level={1} className="text-3xl font-bold text-white mb-8">Meus Dados</PageTitle>
      
      <Card className="p-8 bg-brand-card border border-brand-border/30">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-brand-primary flex items-center justify-center text-white text-3xl font-bold mb-4">
            {name ? name[0].toUpperCase() : <User size={40} />}
          </div>
          <h2 className="text-xl text-white font-semibold">{name}</h2>
          <p className="text-gray-400">{email}</p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <User size={16} /> Nome Completo
            </label>
            <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={!isEditing}
                className={!isEditing ? "bg-brand-dark/50 border-transparent text-gray-400" : ""}
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <Mail size={16} /> Email
            </label>
            <Input 
                value={email} 
                disabled={true} 
                className="bg-brand-dark/50 border-transparent text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {isEditing ? (
                <div className="flex gap-3">
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="flex-1"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </div>
            ) : (
                <Button 
                    type="button" 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                >
                    Editar Informações
                </Button>
            )}

            <Button 
                type="button" 
                variant="outline" 
                className="w-full border-brand-border/50 hover:bg-brand-dark/50 text-gray-300"
                onClick={() => setShowPasswordModal(true)}
            >
                <Lock size={16} className="mr-2" /> Redefinir Senha
            </Button>
          </div>
        </form>
      </Card>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-brand-card border border-brand-border p-6 rounded-xl w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Alterar Senha</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Senha Atual</label>
                        <Input 
                            type="password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Nova Senha</label>
                        <Input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-300">Confirmar Nova Senha</label>
                        <Input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {passwordError && (
                        <p className="text-brand-red text-sm">{passwordError}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => {
                                setShowPasswordModal(false);
                                setPasswordError('');
                                setCurrentPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? 'Alterando...' : 'Alterar Senha'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
