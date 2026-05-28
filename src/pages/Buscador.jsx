import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Buscador() {
  const [processos, setProcessos] = useState([]);
  const [selecionados, setSelecionados] = useState({});
  const [filtros, setFiltros] = useState({
    numero: '',
    classe: '',
    vara: '',
    comarca: ''
  });
  const [opcoes, setOpcoes] = useState({
    classes: [],
    varas: [],
    comarcas: []
  });
  const [sugestoesNumero, setSugestoesNumero] = useState([]);
  const [sugestoesClasse, setSugestoesClasse] = useState([]);
  const [sugestoesVara, setSugestoesVara] = useState([]);
  const [sugestoesComarca, setSugestoesComarca] = useState([]);
  const [mostraSugestoesClasse, setMostraSugestoesClasse] = useState(false);
  const [mostraSugestoesVara, setMostraSugestoesVara] = useState(false);
  const [mostraSugestoesComarca, setMostraSugestoesComarca] = useState(false);
  const [todosProcessos, setTodosProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    setErro('');
    try {
      const { data, error } = await supabase
        .from('monitoramentos')
        .select('*');

      if (error) throw error;

      setTodosProcessos(data || []);

      if (data) {
        const classes = [...new Set(data.map(p => p.aula).filter(Boolean))].sort();
        const varas = [...new Set(data.map(p => p.vara).filter(Boolean))].sort();
        const comarcas = [...new Set(data.map(p => p.comarca).filter(Boolean))].sort();

        setOpcoes({ classes, varas, comarcas });
      }
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
      setErro('Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  }

  const filtrarSugestoes = (texto, opcao) => {
    if (!texto) return opcao; // Mostra todas se vazio
    return opcao.filter(item =>
      item.toLowerCase().startsWith(texto.toLowerCase())
    );
  };

  const atualizarFiltro = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));

    // Atualizar sugestões
    if (campo === 'numero') {
      const sugestoes = todosProcessos
        .filter(p => p.numero_processo?.toLowerCase().includes(valor.toLowerCase()))
        .slice(0, 5)
        .map(p => p.numero_processo);
      setSugestoesNumero(sugestoes);
    } else if (campo === 'classe') {
      const sugestoes = filtrarSugestoes(valor, opcoes.classes);
      setSugestoesClasse(sugestoes);
      setMostraSugestoesClasse(true);
    } else if (campo === 'vara') {
      const sugestoes = filtrarSugestoes(valor, opcoes.varas);
      setSugestoesVara(sugestoes);
      setMostraSugestoesVara(true);
    } else if (campo === 'comarca') {
      const sugestoes = filtrarSugestoes(valor, opcoes.comarcas);
      setSugestoesComarca(sugestoes);
      setMostraSugestoesComarca(true);
    }
  };

  const selecionarSugestao = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setMostraSugestoesClasse(false);
    setMostraSugestoesVara(false);
    setMostraSugestoesComarca(false);
  };

  async function aplicarFiltros() {
    setBuscando(true);
    setErro('');
    try {
      let resultados = todosProcessos;

      if (filtros.numero.trim()) {
        resultados = resultados.filter(p =>
          p.numero_processo?.toLowerCase().includes(filtros.numero.toLowerCase())
        );
      }
      if (filtros.classe) {
        resultados = resultados.filter(p => p.aula === filtros.classe);
      }
      if (filtros.vara) {
        resultados = resultados.filter(p => p.vara === filtros.vara);
      }
      if (filtros.comarca) {
        resultados = resultados.filter(p => p.comarca === filtros.comarca);
      }

      setProcessos(resultados);
      if (!resultados.length) {
        setErro('Nenhum processo encontrado com esses filtros');
      }
    } catch (e) {
      console.error('Erro ao buscar:', e);
      setErro('Erro ao buscar processos');
      setProcessos([]);
    } finally {
      setBuscando(false);
    }
  }

  function toggleSelecionado(id) {
    setSelecionados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  function enviarParaProcessos() {
    const processosParaEnviar = processos.filter((_, idx) => selecionados[idx]);
    if (processosParaEnviar.length === 0) {
      setErro('Selecione pelo menos um processo');
      return;
    }

    localStorage.setItem('processos_selecionados', JSON.stringify(processosParaEnviar));
    alert(`✅ ${processosParaEnviar.length} processo(s) enviado(s) para a aba "Processos"`);
    setSelecionados({});
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>
          Buscador
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Busque processos das distribuições do TJSP e DataJud
        </p>

        {/* Filtros */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#111' }}>
            Filtros
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            {/* Número do Processo */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Número do Processo
              </label>
              <input
                type="text"
                placeholder="Ex: 0000001-23.2024.1.00.0000"
                value={filtros.numero}
                onChange={(e) => atualizarFiltro('numero', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Classe Processual - Autocomplete */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Classe Processual
              </label>
              <input
                type="text"
                placeholder="Digite e veja sugestões..."
                value={filtros.classe}
                onChange={(e) => atualizarFiltro('classe', e.target.value)}
                onFocus={() => setMostraSugestoesClasse(true)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {mostraSugestoesClasse && sugestoesClasse.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  zIndex: 200,
                  marginTop: '-6px'
                }}>
                  {sugestoesClasse.map((classe, idx) => (
                    <div
                      key={idx}
                      onClick={() => selecionarSugestao('classe', classe)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      {classe}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vara - Autocomplete */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Vara
              </label>
              <input
                type="text"
                placeholder="Digite e veja sugestões..."
                value={filtros.vara}
                onChange={(e) => atualizarFiltro('vara', e.target.value)}
                onFocus={() => setMostraSugestoesVara(true)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {mostraSugestoesVara && sugestoesVara.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  zIndex: 200,
                  marginTop: '-6px'
                }}>
                  {sugestoesVara.map((vara, idx) => (
                    <div
                      key={idx}
                      onClick={() => selecionarSugestao('vara', vara)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      {vara}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comarca - Autocomplete */}
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                Comarca
              </label>
              <input
                type="text"
                placeholder="Digite e veja sugestões..."
                value={filtros.comarca}
                onChange={(e) => atualizarFiltro('comarca', e.target.value)}
                onFocus={() => setMostraSugestoesComarca(true)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {mostraSugestoesComarca && sugestoesComarca.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderTop: 'none',
                  borderRadius: '0 0 6px 6px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  zIndex: 200,
                  marginTop: '-6px'
                }}>
                  {sugestoesComarca.map((comarca, idx) => (
                    <div
                      key={idx}
                      onClick={() => selecionarSugestao('comarca', comarca)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f9ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      {comarca}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={aplicarFiltros}
              disabled={buscando || loading}
              style={{
                padding: '12px 24px',
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {buscando ? '🔍 Buscando...' : '🔍 Buscar'}
            </button>
            <button
              onClick={() => {
                setFiltros({ numero: '', classe: '', vara: '', comarca: '' });
                setProcessos([]);
                setErro('');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ✕ Limpar
            </button>
          </div>
        </div>

        {/* Mensagens */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
            ⏳ Carregando filtros...
          </div>
        )}

        {erro && (
          <div style={{ padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '24px', color: '#991b1b' }}>
            ⚠️ {erro}
          </div>
        )}

        {/* Resultados */}
        {processos.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>
                {processos.length} processo(s) encontrado(s)
                {Object.values(selecionados).filter(Boolean).length > 0 && (
                  <span style={{ marginLeft: '16px', color: '#0066cc' }}>
                    ({Object.values(selecionados).filter(Boolean).length} selecionado(s))
                  </span>
                )}
              </span>
              {Object.values(selecionados).filter(Boolean).length > 0 && (
                <button
                  onClick={enviarParaProcessos}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  ✓ Enviar para Processos
                </button>
              )}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151', width: '50px' }}>
                    ☑
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Número do Processo
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Classe
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Vara
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Comarca
                  </th>
                </tr>
              </thead>
              <tbody>
                {processos.map((proc, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: selecionados[idx] ? '#f0f9ff' : 'white' }}>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selecionados[idx] || false}
                        onChange={() => toggleSelecionado(idx)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                    </td>
                    <td style={{ padding: '12px 16px', color: '#111', fontWeight: '500' }}>
                      {proc.numero_processo}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      {proc.aula || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      {proc.vara || '-'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      {proc.comarca || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
