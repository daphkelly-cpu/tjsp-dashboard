import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NexumLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validação básica
    if (!email || !senha) {
      setError('Email e senha são obrigatórios');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      setLoading(false);
      return;
    }

    if (senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // Armazenar sessão simulada no localStorage
      localStorage.setItem('nexum_auth', JSON.stringify({ email, timestamp: new Date().toISOString() }));

      setSuccess('Login realizado com sucesso! Redirecionando...');

      // Redirecionar para dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Lógica para recuperação de senha
    console.log('Forgot password:', email);
    alert('Em breve você receberá um email para recuperar sua senha');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <svg width="80" height="80" viewBox="0 0 100 100" className="text-teal-500">
            {/* Curva Nexum - Azul para Teal */}
            <defs>
              <linearGradient id="nexumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14213d" />
                <stop offset="100%" stopColor="#fca311" />
              </linearGradient>
            </defs>
            <path
              d="M 20 70 Q 40 30 80 20"
              stroke="url(#nexumGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>NEXUM</h1>
          <p className="text-gray-500 text-sm mt-2">Monitoramento de Processos Jurídicos</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-3 top-3 text-teal-500">
              <Mail size={20} />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-700 placeholder-gray-400 transition-colors"
              disabled={loading}
            />
          </div>

          {/* Senha Input */}
          <div className="relative">
            <div className="absolute left-3 top-3 text-teal-500">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-gray-700 placeholder-gray-400 transition-colors"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-teal-500 transition-colors"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              marginTop: '24px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.opacity = '1';
            }}
          >
            {loading ? 'Conectando...' : 'Entrar'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-teal-500 hover:text-teal-600 text-sm font-medium underline transition-colors"
          >
            Esqueci minha senha
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-xs">
            © 2026 NEXUM - Plataforma de Monitoramento Jurídico
          </p>
        </div>
      </div>
    </div>
  );
}