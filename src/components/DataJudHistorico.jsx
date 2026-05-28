import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function DataJudHistorico() {
  const [historico, setHistorico] = useState([]);
  const [metricas, setMetricas] = useState({
    taxaSucesso: 0,
    totalProcessos: 0,
    tempoMedio: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarHistorico = async () => {
    try {
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('log_execucoes')
        .select('*')
        .order('data_execucao', { ascending: false })
        .limit(10);

      if (fetchError) throw fetchError;

      setHistorico(data || []);

      // Calcular métricas
      if (data && data.length > 0) {
        const sucessos = data.filter((item) => item.status === 'success').length;
        const taxaSucesso = ((sucessos / data.length) * 100).toFixed(1);
        const totalProcessos = data.reduce((sum, item) => sum + (item.casos_verificados || 0), 0);
        const tempoMedio = (
          data.reduce((sum, item) => sum + (item.tempo_execucao_ms || 0), 0) / data.length
        ).toFixed(0);

        setMetricas({
          taxaSucesso,
          totalProcessos,
          tempoMedio,
        });
      }
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarHistorico();
    const intervalo = setInterval(carregarHistorico, 10 * 60 * 1000); // 10 minutos
    return () => clearInterval(intervalo);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
        Carregando histórico...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
        Erro ao carregar histórico: {error}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#111' }}>
        📈 Histórico de Execuções
      </h2>

      {historico.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
          Nenhuma execução registrada ainda.
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Data/Hora
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>
                    Verificados
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>
                    Atualizados
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>
                    Tempo (ms)
                  </th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: idx < historico.length - 1 ? '1px solid #e5e7eb' : 'none',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                    }}
                  >
                    <td style={{ padding: '12px', color: '#374151' }}>
                      {new Date(item.data_execucao).toLocaleString('pt-BR')}
                    </td>
                    <td style={{ padding: '12px', color: '#374151' }}>
                      <span style={{ fontSize: '18px' }}>
                        {item.status === 'success' ? '✅' : '❌'}
                      </span>{' '}
                      {item.status === 'success' ? 'OK' : 'Erro'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>
                      {item.casos_verificados || 0}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>
                      {item.casos_atualizados || 0}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#374151' }}>
                      {item.tempo_execucao_ms || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                Taxa de Sucesso
              </p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>
                {metricas.taxaSucesso}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                Total de Processos
              </p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
                {metricas.totalProcessos.toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>
                Tempo Médio (ms)
              </p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>
                {metricas.tempoMedio.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
