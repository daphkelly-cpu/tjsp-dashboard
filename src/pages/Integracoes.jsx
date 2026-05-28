import { FolderOpen, CheckSquare, BarChart3 } from 'lucide-react';

export default function Integracoes() {
  const integracoes = [
    {
      nome: 'Google Drive',
      icon: FolderOpen,
      descricao: 'Salve suas análises e minutas em Google Drive',
      status: 'Desconectado',
      statusCor: '#fee2e2',
      textoCor: '#991b1b',
      acao: 'Conectar'
    },
    {
      nome: 'Trello',
      icon: CheckSquare,
      descricao: 'Crie cards automaticamente no Trello para cada análise',
      status: 'Desconectado',
      statusCor: '#fee2e2',
      textoCor: '#991b1b',
      acao: 'Conectar'
    },
    {
      nome: 'DataJud',
      icon: BarChart3,
      descricao: 'Integração com o sistema DataJud de monitoramento',
      status: 'Conectado',
      statusCor: '#dcfce7',
      textoCor: '#166534',
      acao: 'Gerenciar'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>
          Integrações
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Conecte NEXUM com suas ferramentas favoritas para maior produtividade
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {integracoes.map((integracao, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                {<integracao.icon size={48} color='var(--color-accent)' strokeWidth={1.5} />}
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>
                {integracao.nome}
              </h3>

              <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', flex: 1 }}>
                {integracao.descricao}
              </p>

              <div
                style={{
                  padding: '8px 12px',
                  backgroundColor: integracao.statusCor,
                  color: integracao.textoCor,
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}
              >
                {integracao.status}
              </div>

              <button
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {integracao.acao}
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '32px',
            borderLeft: '4px solid #22c55e'
          }}
        >
          <p style={{ margin: '0', color: '#166534', fontWeight: '600' }}>
            💡 Dica: Conectar integrações permite que suas análises sejam automaticamente enviadas para seus
            documentos e cards
          </p>
        </div>
      </div>
    </div>
  );
}
