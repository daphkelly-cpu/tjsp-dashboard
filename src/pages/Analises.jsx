import { useState, useEffect } from 'react';
import Buscador from '../components/Buscador';
import ProcessosSelecionados from '../components/ProcessosSelecionados';
import MeusProcessos from '../components/MeusProcessos';
import SidebarAnaliseIA from '../components/SidebarAnaliseIA';

export default function Analises() {
  const [processosSelecionados, setProcessosSelecionados] = useState([]);
  const [processosUpload, setProcessosUpload] = useState([]);
  const [processoAtivo, setProcessoAtivo] = useState(null);

  // Carregar processos do localStorage quando abrir a página
  useEffect(() => {
    const processosLocalStorage = localStorage.getItem('processos_analises');
    if (processosLocalStorage) {
      try {
        const processos = JSON.parse(processosLocalStorage);
        setProcessosSelecionados(processos);
        localStorage.removeItem('processos_analises'); // Limpar após carregar
      } catch (e) {
        console.error('Erro ao carregar processos:', e);
      }
    }
  }, []);

  function handleRemoverProcesso(id) {
    setProcessosSelecionados(processosSelecionados.filter(p => p.numero_processo !== id));
  }

  function handleAdicionarUpload(processo) {
    setProcessosUpload([...processosUpload, processo]);
  }

  function handleSelecionarBuscador(processos) {
    setProcessosSelecionados(processos);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Painel Esquerdo */}
        <div
          style={{
            flex: '0 0 380px',
            backgroundColor: 'white',
            borderRight: '1px solid #e5e7eb',
            overflowY: 'auto',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {/* Buscador */}
          <Buscador onSelecionados={setProcessosSelecionados} />

          {/* Processos Selecionados */}
          <ProcessosSelecionados
            processos={processosSelecionados}
            onRemover={handleRemoverProcesso}
            onAnalizar={setProcessoAtivo}
          />

          {/* Meus Processos (Upload) */}
          <MeusProcessos
            processos={processosUpload}
            onNovoProcesso={handleAdicionarUpload}
            onAnalizar={setProcessoAtivo}
          />

          {/* Info */}
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#ecfdf5',
              borderLeft: '3px solid #10b981',
              borderRadius: '6px'
            }}
          >
            <p style={{ margin: '0', fontSize: '12px', color: '#047857', lineHeight: '1.6' }}>
              <strong>Dica:</strong> Selecione processos ou faça upload de PDFs, depois clique em "IA" para ver a análise no painel lateral.
            </p>
          </div>
        </div>

        {/* Painel Direito (Conteúdo Principal ou Sidebar) */}
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {!processoAtivo ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#9ca3af'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📋</p>
                <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', color: 'var(--color-primary)' }}>
                  Selecione um processo para analisar
                </p>
                <p style={{ fontSize: '14px', color: '#d1d5db' }}>
                  Use o buscador ou faça upload de um PDF
                </p>
              </div>
            </div>
          ) : (
            <SidebarAnaliseIA
              processo={processoAtivo}
              onFechar={() => setProcessoAtivo(null)}
              processosSelecionados={processosSelecionados}
            />
          )}
        </div>
      </div>
    </div>
  );
}
