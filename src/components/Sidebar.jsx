import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Search, FolderOpen, FileText, Brain, Plug, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Buscador', path: '/buscador' },
    { icon: FolderOpen, label: 'Meus Processos', path: '/meus-processos' },
    { icon: FileText, label: 'Processos', path: '/processos' },
    { icon: Brain, label: 'Análises IA', path: '/analises' },
    { icon: Plug, label: 'Integrações', path: '/integracoes' }
  ];

  async function handleLogout() {
    // Limpar autenticação simulada
    localStorage.removeItem('nexum_auth');

    // Tentar fazer logout no Supabase se houver sessão real
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log('Sem sessão Supabase ativa');
    }

    navigate('/login');
  }

  return (
    <div
      style={{
        width: '220px',
        backgroundColor: 'var(--color-bg)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        padding: '20px 0',
        position: 'fixed',
        left: 0,
        top: 0
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 16px', marginBottom: '32px' }}>
        <h1 style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)' }}>
          NEXUM
        </h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Monitor Jurídico
        </p>
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px' }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'white' : '#4b5563',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                textAlign: 'left',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-border)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <IconComponent size={20} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Stats Footer */}
      <div style={{ padding: '16px', backgroundColor: '#e0f2fe', borderRadius: '8px', margin: '0 8px 16px 8px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LayoutDashboard size={14} /> Status
        </p>
        <p style={{ margin: '0', fontSize: '12px', color: '#0c4a6e' }}>
          50 processos/mês
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#0c4a6e' }}>
          23 análises incluídas
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          margin: '0 8px',
          padding: '10px 12px',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text-muted)',
          border: '1px solid var(--color-border)',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#fee2e2';
          e.currentTarget.style.color = '#991b1b';
          e.currentTarget.style.borderColor = '#fecaca';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg)';
          e.currentTarget.style.color = 'var(--color-text-muted)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        <LogOut size={16} />
        Sair
      </button>
    </div>
  );
}
