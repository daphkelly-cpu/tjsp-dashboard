import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function DataJudStats() {
  const [stats, setStats] = useState({
    totalProcessos: 0,
    coletadosHoje: 0,
    ultimaExecucao: null,
    proximaExecucao: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarStats = async () => {
    try {
      setError(null);

      // Total de processos
      const { data: totalData, error: totalError } = await supabase
        .from('processos_datajud')
        .select('id', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Processos coletados hoje
      const hoje = new Date().toISOString().split('T')[0];
      const { data: hojeData, error: hojeError } = await supabase
        .from('processos_datajud')
        .select('id', { count: 'exact' })
        .gte('data_coleta', `${hoje}T00:00:00`)
        .lte('data_coleta', `${hoje}T23:59:59`);

      if (hojeError) throw hojeError;

      // Última execução
      const { data: ultimaData, error: ultimaError } = await supabase
        .from('log_execucoes')
        .select('*')
        .order('data_execucao', { ascending: false })
        .limit(1);

      if (ultimaError) throw ultimaError;

      const ultimaExecucao = ultimaData && ultimaData.length > 0 ? ultimaData[0] : null;
      let proximaExecucao = null;

      if (ultimaExecucao?.data_execucao) {
        const ultima = new Date(ultimaExecucao.data_execucao);
        const proxima = new Date(ultima.getTime() + 3 * 60 * 60 * 1000); // 3 horas depois
        proximaExecucao = proxima.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      setStats({
        totalProcessos: totalData?.length || 0,
        coletadosHoje: hojeData?.length || 0,
        ultimaExecucao: ultimaExecucao?.data_execucao
          ? new Date(ultimaExecucao.data_execucao).toLocaleTimeString('pt-BR')
          : 'Nunca',
        proximaExecucao: proximaExecucao || 'Não planejado',
      });
    } catch (err) {
      console.error('Erro ao carregar stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarStats();
    const intervalo = setInterval(carregarStats, 5 * 60 * 1000); // 5 minutos
    return () => clearInterval(intervalo);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
        Carregando estatísticas...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
        Erro ao carregar estatísticas: {error}
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#111' }}>
        📊 Monitor DataJud
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        <Card
          title="🗂️ Total de Processos"
          value={stats.totalProcessos.toLocaleString('pt-BR')}
          color="blue"
        />
        <Card
          title="📥 Coletados Hoje"
          value={stats.coletadosHoje.toLocaleString('pt-BR')}
          color="green"
        />
        <Card
          title="⏱️ Última Execução"
          value={stats.ultimaExecucao}
          color="purple"
        />
        <Card
          title="⏰ Próxima Execução"
          value={stats.proximaExecucao}
          color="orange"
        />
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  const colorMap = {
    blue: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
    green: { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' },
    purple: { bg: '#faf5ff', border: '#a855f7', text: '#6b21a8' },
    orange: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
  };

  const styles = colorMap[color];

  return (
    <div
      style={{
        backgroundColor: styles.bg,
        border: `2px solid ${styles.border}`,
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <p style={{ color: styles.text, fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
        {title}
      </p>
      <p style={{ color: styles.text, fontSize: '28px', fontWeight: 'bold' }}>
        {value}
      </p>
    </div>
  );
}
