// Trello Service
// Cria card "Nexum" com estrutura de processos

export const trelloService = {
  async criarCard(processos, analises) {
    try {
      // TODO: Implementar autenticação Trello API
      // Requer: TRELLO_API_KEY + TRELLO_TOKEN + BOARD_ID

      const hoje = new Date().toLocaleDateString('pt-BR');
      const cardData = {
        nome: `Nexum - ${hoje}`,
        descricao: `Processos analisados: ${processos.length}`,
        processos: processos.map((proc, idx) => ({
          numero: proc.numero,
          pecaCabivel: analises[idx]?.pecaCabivel,
          argumentacao: analises[idx]?.cabimento,
          minuta: analises[idx]?.minutaRascunho
        }))
      };

      console.log('Card Trello preparado:', cardData);

      // Retornar mock de sucesso
      return {
        sucesso: false,
        mensagem: 'Trello requer API Key e Token. Configure em Settings.',
        cardData: cardData,
        dica: 'Implemente com Trello SDK e credenciais'
      };
    } catch (erro) {
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }
};
