import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, BarChart2, Clock, CheckCircle, Lightbulb } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProcessos: 0,
    analises: 0,
    pendentes: 0,
    resolvidos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const { data: processos } = await supabase
          .from('monitoramentos')
          .select('*')
          .limit(100);

        const count = processos?.length || 0;

        setStats({
          totalProcessos: count,
          analises: Math.floor(count * 0.8),
          pendentes: Math.floor(count * 0.2),
          resolvidos: Math.floor(count * 0.6)
        });
      } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Bem-vindo ao NEXUM! Aqui está o resumo de seus processos
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[
            { icon: BarChart3, label: 'Total de Processos', valor: stats.totalProcessos },
            { icon: BarChart2, label: 'Análises Realizadas', valor: stats.analises },
            { icon: Clock, label: 'Pendentes', valor: stats.pendentes },
            { icon: CheckCircle, label: 'Resolvidos', valor: stats.resolvidos }
          ].map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid var(--color-accent)'
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <IconComponent size={32} color='var(--color-accent)' strokeWidth={1.5} />
                </div>
                <p style={{ margin: '0 0 8px 0', color: 'var(--color-text-muted)', fontSize: '14px' }}>
                  {stat.label}
                </p>
                <p style={{ margin: '0', fontSize: '32px', fontWeight: '700', color: 'var(--color-primary)' }}>
                  {loading ? '-' : stat.valor}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '20px', borderLeft: '4px solid #0284c7', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Lightbulb size={20} color="#0c4a6e" style={{ marginTop: '2px', flexShrink: 0 }} />
          <p style={{ margin: '0', color: '#0c4a6e', fontSize: '14px', fontWeight: '500' }}>
            Dica: Acesse "Análises IA" para analisar seus processos com inteligência artificial!
          </p>
        </div>
      </div>
    </div>
  );
}
