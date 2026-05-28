import { useState, useEffect } from 'react';
import { claudeService } from '../services/claudeService';
import { pdfService } from '../services/pdfService';
import { googleDriveService } from '../services/googleDriveService';
import { trelloService } from '../services/trelloService';

export default function SidebarAnaliseIA({ processo, onFechar, processosSelecionados }) {
  const [analise, setAnalise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  async function analisarProcesso() {
    try {
      setLoading(true);
      setErro(null);
      setAnalise(null);

      // Preparar texto para análise
      // Prioriza: PDF binário Supabase > PDF uploaded > metadados básicos
      let textoAnalise;

      if (processo.pdf_dados) {
        // PDF binário do Supabase (Apps Script)
        const result = await pdfService.extrairDePDF(processo.pdf_dados);
        if (!result.sucesso) throw new Error(result.erro);
        textoAnalise = result.texto;
      } else if (processo.texto) {
        // PDF do upload do usuário (já tem texto extraído)
        textoAnalise = processo.texto;
      } else {
        // Fallback: metadados básicos
        textoAnalise = `Processo nº ${processo.numero_processo}\n` +
                       `Tribunal: ${processo.tribunal || 'N/A'}\n` +
                       `Vara: ${processo.vara || 'N/A'}\n` +
                       `Comarca: ${processo.comarca || 'N/A'}\n` +
                       `Partes: ${processo.partes || 'N/A'}\n` +
                       `Classe: ${processo.aula || 'N/A'}`;
      }

      const resultado = await claudeService.analisarProcesso(textoAnalise);

      if (resultado.sucesso) {
        setAnalise(resultado);
      } else {
        setErro(resultado.erro);
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function enviarParaDrive() {
    const processos = processosSelecionados.length > 0 ? processosSelecionados : [processo];
    const analises = [analise];

    const resultado = await googleDriveService.criarEstrutura(processos, analises);

    if (resultado.sucesso) {
      alert('✅ Processos salvos no Google Drive!');
    } else {
      alert('⚠️ ' + resultado.mensagem);
    }
  }

  async function enviarParaTrello() {
    const processos = processosSelecionados.length > 0 ? processosSelecionados : [processo];
    const analises = [analise];

    const resultado = await trelloService.criarCard(processos, analises);

    if (resultado.sucesso) {
      alert('✅ Card criado no Trello!');
    } else {
      alert('⚠️ ' + resultado.mensagem);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100vh',
        width: '500px',
        backgroundColor: 'white',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        zIndex: 1000,
        '@media (max-width: 1200px)': {
          width: '100%'
        }
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700', color: '#111' }}>
          📋 Análise IA
        </h2>
        <button
          onClick={onFechar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0'
          }}
        >
          ✕
        </button>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '20px' }}>
        {/* Info do Processo */}
        <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#6b7280' }}>PROCESSO</p>
          <p style={{ margin: '0', fontSize: '13px', fontWeight: '600', color: '#111' }}>
            {processo.numero_processo}
          </p>
        </div>

        {/* Botão Analisar (antes de qualquer análise) */}
        {!analise && !loading && !erro && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={analisarProcesso}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                marginBottom: '12px'
              }}
            >
              Analisar com IA
            </button>
            <p style={{ margin: '0', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
              Clique no botão acima para iniciar a análise jurídica deste processo
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px', animation: 'pulse 2s' }}>⏳</div>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Analisando com Claude IA...</p>
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '20px' }}>
            <p style={{ margin: '0', fontSize: '13px', color: '#991b1b' }}>
              ❌ {erro}
            </p>
          </div>
        )}

        {/* Análise */}
        {analise && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Peça Cabível */}
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#111' }}>
                ✅ Peça Cabível
              </h3>
              <p
                style={{
                  margin: '0',
                  padding: '12px',
                  backgroundColor: '#d1fae5',
                  borderLeft: '3px solid #10b981',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#047857'
                }}
              >
                {analise.pecaCabivel}
              </p>
            </div>

            {/* Argumentação */}
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#111' }}>
                📖 Argumentação/Cabimento
              </h3>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#1e40af',
                  lineHeight: '1.6',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {analise.cabimento}
              </div>
            </div>

            {/* Minuta */}
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#111' }}>
                📄 Rascunho de Minuta
              </h3>
              <textarea
                value={analise.minutaRascunho}
                readOnly
                style={{
                  width: '100%',
                  height: '200px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#374151',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={enviarParaDrive}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                📁 Google Drive
              </button>
              <button
                onClick={enviarParaTrello}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#0052cc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                📋 Trello
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
