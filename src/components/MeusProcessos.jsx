import { useState } from 'react';
import { pdfService } from '../services/pdfService';

export default function MeusProcessos({ processos, onNovoProcesso, onAnalizar }) {
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleFileUpload(e) {
    const arquivos = e.target.files;
    if (!arquivos) return;

    setErro(null);
    setUploading(true);

    for (let arquivo of arquivos) {
      const resultado = await pdfService.extrairTexto(arquivo);

      if (resultado.sucesso) {
        onNovoProcesso({
          id: Date.now() + Math.random(),
          tipo: 'upload',
          numero_processo: arquivo.name.replace('.pdf', ''),
          aula: 'PDF Importado',
          vara: arquivo.name,
          texto: resultado.texto
        });
      } else {
        setErro(resultado.erro);
      }
    }

    setUploading(false);
  }

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-primary)' }}>
        Meus Processos (Upload PDF)
      </h3>

      <label
        htmlFor="pdfUpload"
        style={{
          display: 'block',
          padding: '24px',
          border: '2px dashed #bfdbfe',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#f0f9ff',
          marginBottom: '12px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e0f2fe';
          e.currentTarget.style.borderColor = '#0066cc';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f9ff';
          e.currentTarget.style.borderColor = '#bfdbfe';
        }}
      >
        <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-accent)', margin: '0 0 4px 0' }}>
          {uploading ? 'Processando...' : 'Clique ou arraste PDFs aqui'}
        </p>
        <p style={{ fontSize: '12px', color: '#0284c7', margin: '0' }}>
          Suporta um ou mais arquivos PDF
        </p>
        <input
          id="pdfUpload"
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>

      {erro && (
        <p style={{ fontSize: '12px', color: '#991b1b', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '4px', margin: '0 0 12px 0' }}>
          ❌ {erro}
        </p>
      )}

      {processos.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '12px 0' }}>
          Nenhum PDF importado ainda
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {processos.map((proc) => (
            <div
              key={proc.id}
              style={{
                padding: '12px',
                backgroundColor: '#fefce8',
                border: '1px solid #fef08a',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 4px 0' }}>
                  {proc.numero_processo}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                  {proc.vara}
                </p>
              </div>
              <button
                onClick={() => onAnalizar(proc)}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                IA
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
