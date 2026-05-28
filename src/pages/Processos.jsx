import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SidebarAnaliseIA from '../components/SidebarAnaliseIA';
import { Brain, X } from 'lucide-react';

export default function Processos() {
  // Estados de dados
  const [todosProcessos, setTodosProcessos] = useState([]);
  const [processosLista, setProcessosLista] = useState([]);

  // Estados de filtro/busca
  const [filtros, setFiltros] = useState({
    numero: '',
    partes: '',
    aula: '',
    vara: '',
    comarca: ''
  });

  // Estados de análise
  const [processoAtivo, setProcessoAtivo] = useState(null);
  const [sidebarAberto, setSidebarAberto] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect: carregar Supabase
  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('monitoramentos')
        .select('*')
        .order('data_registro', { ascending: false });

      if (error) throw error;

      setTodosProcessos(data || []);
      setProcessosLista(data || []);
    } catch (e) {
      console.error('Erro ao carregar processos:', e);
    } finally {
      setLoading(false);
    }
  }

  // Aplicar filtros em tempo real
  function aplicarFiltros() {
    let resultado = todosProcessos;

    if (filtros.numero.trim()) {
      resultado = resultado.filter(p =>
        p.numero_processo?.toLowerCase().includes(filtros.numero.toLowerCase())
      );
    }
    if (filtros.partes.trim()) {
      resultado = resultado.filter(p =>
        p.partes?.toLowerCase().includes(filtros.partes.toLowerCase())
      );
    }
    if (filtros.aula.trim()) {
      resultado = resultado.filter(p => p.aula === filtros.aula);
    }
    if (filtros.vara.trim()) {
      resultado = resultado.filter(p => p.vara === filtros.vara);
    }
    if (filtros.comarca.trim()) {
      resultado = resultado.filter(p => p.comarca === filtros.comarca);
    }

    setProcessosLista(resultado);
  }

  // Atualizar filtro e aplicar
  function atualizarFiltro(campo, valor) {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    // Aplicar filtro com delay
    setTimeout(() => {
      setFiltros(prev => {
        const novosFiltros = { ...prev, [campo]: valor };
        aplicarFiltrosComEstado(novosFiltros);
        return novosFiltros;
      });
    }, 0);
  }

  function aplicarFiltrosComEstado(filtrosAtivos) {
    let resultado = todosProcessos;

    if (filtrosAtivos.numero.trim()) {
      resultado = resultado.filter(p =>
        p.numero_processo?.toLowerCase().includes(filtrosAtivos.numero.toLowerCase())
      );
    }
    if (filtrosAtivos.partes.trim()) {
      resultado = resultado.filter(p =>
        p.partes?.toLowerCase().includes(filtrosAtivos.partes.toLowerCase())
      );
    }
    if (filtrosAtivos.aula.trim()) {
      resultado = resultado.filter(p => p.aula === filtrosAtivos.aula);
    }
    if (filtrosAtivos.vara.trim()) {
      resultado = resultado.filter(p => p.vara === filtrosAtivos.vara);
    }
    if (filtrosAtivos.comarca.trim()) {
      resultado = resultado.filter(p => p.comarca === filtrosAtivos.comarca);
    }

    setProcessosLista(resultado);
  }

  function abrirAnalise(processo) {
    setProcessoAtivo(processo);
    setSidebarAberto(true);
  }

  function removerProcesso(numero) {
    const novaLista = processosLista.filter(p => p.numero_processo !== numero);
    setProcessosLista(novaLista);
  }

  function limparFiltros() {
    setFiltros({
      numero: '',
      partes: '',
      aula: '',
      vara: '',
      comarca: ''
    });
    setProcessosLista(todosProcessos);
  }

  // Obter listas únicas para dropdowns
  const aulasUnicas = [...new Set(todosProcessos.map(p => p.aula).filter(Boolean))].sort();
  const varasUnicas = [...new Set(todosProcessos.map(p => p.vara).filter(Boolean))].sort();
  const comarcasUnicas = [...new Set(todosProcessos.map(p => p.comarca).filter(Boolean))].sort();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* PAINEL PRINCIPAL */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginRight: sidebarAberto ? '500px' : '0',
        transition: 'margin-right 0.3s ease'
      }}>
        <div style={{ padding: '32px 24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* HEADER */}
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>
              Processos
            </h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
              Consulte, busque e analise processos jurídicos
            </p>

            {/* SEÇÃO 1: FILTROS */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--color-primary)' }}>
                Filtros
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '16px'
              }}>
                {/* Número do Processo */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    Número Processo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 0000382-24..."
                    value={filtros.numero}
                    onChange={(e) => atualizarFiltro('numero', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Partes */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    Partes
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: João Silva"
                    value={filtros.partes}
                    onChange={(e) => atualizarFiltro('partes', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Classe */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    Classe
                  </label>
                  <select
                    value={filtros.aula}
                    onChange={(e) => atualizarFiltro('aula', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Todas</option>
                    {aulasUnicas.map(aula => (
                      <option key={aula} value={aula}>{aula}</option>
                    ))}
                  </select>
                </div>

                {/* Vara */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    Vara
                  </label>
                  <select
                    value={filtros.vara}
                    onChange={(e) => atualizarFiltro('vara', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Todas</option>
                    {varasUnicas.map(vara => (
                      <option key={vara} value={vara}>{vara}</option>
                    ))}
                  </select>
                </div>

                {/* Comarca */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '6px',
                    color: '#374151'
                  }}>
                    Comarca
                  </label>
                  <select
                    value={filtros.comarca}
                    onChange={(e) => atualizarFiltro('comarca', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Todas</option>
                    {comarcasUnicas.map(comarca => (
                      <option key={comarca} value={comarca}>{comarca}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={limparFiltros}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                ↻ Limpar Filtros
              </button>
            </div>

            {/* SEÇÃO 2: TABELA */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {loading ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                  Carregando processos...
                </div>
              ) : processosLista.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                  Nenhum processo encontrado
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '12px', padding: '16px 24px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb', fontSize: '13px', color: '#6b7280' }}>
                    <span>Total: <strong>{processosLista.length}</strong> processo(s)</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Número</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Partes</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Classe</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Vara</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Comarca</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', fontSize: '13px' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processosLista.map((proc) => (
                        <tr key={proc.id} style={{ borderBottom: '1px solid #e5e7eb', hover: { backgroundColor: '#f9fafb' } }}>
                          <td style={{ padding: '12px 16px', color: '#111', fontWeight: '500', fontSize: '13px' }}>
                            {proc.numero_processo}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                            {proc.partes || '-'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                            {proc.aula || '-'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                            {proc.vara || '-'}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>
                            {proc.comarca || '-'}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => abrirAnalise(proc)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: 'var(--color-accent)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}
                                title="Analisar com IA"
                              >
                                <Brain size={16} />
                              </button>
                              <button
                                onClick={() => removerProcesso(proc.numero_processo)}
                                style={{
                                  padding: '6px 10px',
                                  backgroundColor: '#fee2e2',
                                  color: '#991b1b',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                                title="Remover"
                              >
                                <X size={14} strokeWidth={3} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR ANÁLISE IA */}
      {sidebarAberto && processoAtivo && (
        <SidebarAnaliseIA
          processo={processoAtivo}
          onFechar={() => setSidebarAberto(false)}
        />
      )}
    </div>
  );
}
