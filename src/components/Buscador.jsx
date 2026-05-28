import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Buscador({ onSelecionados }) {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [selecionados, setSelecionados] = useState({});
  const [todosProcessos, setTodosProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    carregarTodos();
  }, []);

  async function carregarTodos() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('monitoramentos')
        .select('*');

      if (error) throw error;
      setTodosProcessos(data || []);
    } catch (erro) {
      console.error('Erro ao carregar processos:', erro);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (busca.trim().length < 2) {
      setResultados([]);
      return;
    }

    const filtrados = todosProcessos.filter(p =>
      p.numero_processo?.toLowerCase().includes(busca.toLowerCase()) ||
      p.aula?.toLowerCase().includes(busca.toLowerCase()) ||
      p.vara?.toLowerCase().includes(busca.toLowerCase())
    );
    setResultados(filtrados);
  }, [busca, todosProcessos]);

  function toggleSelecionado(idx) {
    const novo = { ...selecionados };
    novo[idx] = !novo[idx];
    setSelecionados(novo);

    const processosSelecionados = resultados.filter((_, i) => novo[i]);
    onSelecionados(processosSelecionados);
  }

  function enviarParaAnalises() {
    const processosParaEnviar = resultados.filter((_, idx) => selecionados[idx]);
    if (processosParaEnviar.length === 0) {
      alert('⚠️ Selecione pelo menos um processo');
      return;
    }

    localStorage.setItem('processos_analises', JSON.stringify(processosParaEnviar));
    alert(`✅ ${processosParaEnviar.length} processo(s) enviado(s) para Análises`);
    setSelecionados({});
  }

  return (
    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#111' }}>
        🔍 Buscador
      </h3>

      <input
        type="text"
        placeholder="Buscar por processo, classe, vara..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          marginBottom: '12px',
          fontSize: '14px'
        }}
      />

      {loading && <p style={{ color: '#6b7280', fontSize: '13px' }}>Buscando...</p>}

      {resultados.length > 0 && (
        <>
          <div
            style={{
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              marginBottom: '12px'
            }}
          >
            {resultados.map((proc, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  backgroundColor: selecionados[idx] ? '#eff6ff' : 'white'
                }}
              >
                <input
                  type="checkbox"
                  checked={selecionados[idx] || false}
                  onChange={() => toggleSelecionado(idx)}
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#111',
                      margin: '0 0 4px 0'
                    }}
                  >
                    {proc.numero_processo}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                    {proc.aula} • {proc.vara}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {Object.values(selecionados).filter(Boolean).length > 0 && (
            <button
              onClick={enviarParaAnalises}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px'
              }}
            >
              📤 Enviar {Object.values(selecionados).filter(Boolean).length} para Análises
            </button>
          )}
        </>
      )}

      {busca && resultados.length === 0 && !loading && (
        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
          Nenhum processo encontrado
        </p>
      )}
    </div>
  );
}
