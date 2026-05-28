import { useState, useRef, useEffect } from 'react';
import { pdfService } from '../services/pdfService';
import { Upload } from 'lucide-react';

export default function MeusProcessos() {
  const [processosUpload, setProcessosUpload] = useState([]);
  const [processosSelecionados, setProcessosSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    carregarProcessosSelecionados();
  }, []);

  function carregarProcessosSelecionados() {
    const selecionados = localStorage.getItem('processos_selecionados');
    if (selecionados) {
      try {
        setProcessosSelecionados(JSON.parse(selecionados));
      } catch (e) {
        console.error('Erro ao carregar processos:', e);
      }
    }
  }

  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setLoading(true);
    try {
      for (const file of files) {
        const resultado = await pdfService.extrairTexto(file);
        if (resultado.sucesso) {
          setProcessosUpload((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              nome: resultado.nomePDF,
              texto: resultado.texto,
              tamanho: resultado.tamanho,
              dataCriacao: new Date().toLocaleDateString('pt-BR')
            }
          ]);
        }
      }
    } catch (erro) {
      console.error('Erro ao processar PDF:', erro);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleRemoveUpload(id) {
    setProcessosUpload((prev) => prev.filter((p) => p.id !== id));
  }

  function handleRemoverSelecionado(numero_processo) {
    setProcessosSelecionados((prev) => prev.filter((p) => p.numero_processo !== numero_processo));
  }

  function calcularDiasRestantes(dataPrazo) {
    if (!dataPrazo) return null;
    const data = new Date(dataPrazo);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Reset time to start of day
    data.setHours(0, 0, 0, 0); // Reset time to start of day
    const diasRestantes = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24));
    return diasRestantes;
  }

  function getStatusPrazo(diasRestantes) {
    if (diasRestantes < 0) return { texto: '❌ Vencido', cor: '#fee2e2', textCor: '#991b1b' };
    if (diasRestantes <= 5) return { texto: `🔴 ${diasRestantes} dias`, cor: '#fee2e2', textCor: '#991b1b' };
    if (diasRestantes <= 20) return { texto: `🟡 ${diasRestantes} dias`, cor: '#fef3c7', textCor: '#92400e' };
    return { texto: `🟢 ${diasRestantes} dias`, cor: '#dcfce7', textCor: '#166534' };
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>
          Meus Processos
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Faça upload de PDFs para análise automática com IA
        </p>

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = '#e0f2fe';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = 'white';
            const files = e.dataTransfer.files;
            const event = { target: { files } };
            handleFileUpload(event);
          }}
          style={{
            backgroundColor: 'white',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '40px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '32px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <Upload size={48} color='var(--color-accent)' strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '8px' }}>
            Arraste PDFs aqui ou clique para selecionar
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Suporte para múltiplos arquivos. Máx 50MB por arquivo.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={loading}
          style={{ display: 'none' }}
        />

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
            <div style={{ display: 'inline-block', fontSize: '32px', marginBottom: '16px' }}>⏳</div>
            <p>Processando PDFs...</p>
          </div>
        )}

        {/* Processos Selecionados do Buscador */}
        {processosSelecionados.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: '#e0f2fe', borderBottom: '1px solid #bfdbfe' }}>
              <p style={{ margin: '0', fontWeight: '600', color: '#0369a1' }}>
                📋 Processos Selecionados ({processosSelecionados.length})
              </p>
            </div>

            {processosSelecionados.map((proc, idx) => {
              const diasRestantes = calcularDiasRestantes(proc.data_prazo);
              const statusPrazo = diasRestantes ? getStatusPrazo(diasRestantes) : { texto: 'Sem prazo', cor: '#e5e7eb', textCor: '#6b7280' };

              return (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#111' }}>
                      📋 {proc.numero_processo}
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6b7280' }}>
                      {proc.aula} • {proc.vara}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          backgroundColor: statusPrazo.cor,
                          color: statusPrazo.textCor,
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {statusPrazo.texto}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoverSelecionado(proc.numero_processo)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    ✕ Remover
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* PDFs Uploaded */}
        {processosUpload.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderBottom: '1px solid #fde68a' }}>
              <p style={{ margin: '0', fontWeight: '600', color: '#92400e' }}>
                📄 PDFs Carregados ({processosUpload.length})
              </p>
            </div>

            {processosUpload.map((proc) => (
              <div
                key={proc.id}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#111' }}>
                    📄 {proc.nome}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#6b7280' }}>
                    {proc.dataCriacao} • {(proc.tamanho / 1024).toFixed(1)} KB
                  </p>
                  <p style={{ margin: '0', fontSize: '13px', color: 'var(--color-accent)' }}>
                    {proc.texto.split(' ').length} palavras
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveUpload(proc.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fecaca';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                >
                  ✕ Remover
                </button>
              </div>
            ))}
          </div>
        )}

        {processosSelecionados.length === 0 && processosUpload.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
            Nenhum processo carregado. Selecione processos no Buscador ou faça upload de PDFs
          </div>
        )}
      </div>
    </div>
  );
}
