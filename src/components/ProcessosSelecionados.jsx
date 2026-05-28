export default function ProcessosSelecionados({ processos, onRemover, onAnalizar }) {
  return (
    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#111' }}>
        ✅ Processos Selecionados ({processos.length})
      </h3>

      {processos.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
          Nenhum processo selecionado ainda
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {processos.map((proc, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bfdbfe',
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
                  {proc.aula || proc.vara}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
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
                <button
                  onClick={() => onRemover(proc.numero_processo)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
