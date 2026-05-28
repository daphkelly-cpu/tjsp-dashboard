import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

export const claudeService = {
  async analisarProcesso(textoOuNumeroProcesso) {
    try {
      if (!textoOuNumeroProcesso || textoOuNumeroProcesso.trim().length === 0) {
        throw new Error('Forneça o texto do processo ou número para análise');
      }

      const prompt = `Você é um analista jurídico experiente. Analise o seguinte processo jurídico e responda em JSON válido com os campos exatos abaixo:

PROCESSO:
${textoOuNumeroProcesso}

Responda em JSON (sem markdown, sem backticks, apenas JSON válido):
{
  "pecaCabivel": "Nome da peça processual mais apropriada (ex: Recurso de Apelação, Petição Inicial, etc)",
  "cabimento": "Análise jurídica breve sobre por que essa peça é cabível (2-3 parágrafos)",
  "minutaRascunho": "Rascunho de minuta da peça processual em formato de texto estruturado com tópicos principais"
}

Garanta que o JSON seja válido e sem erros de sintaxe.`;

      const message = await client.messages.create({
        model: 'claude-opus-4-1',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const resposta = message.content[0].text;

      // Tentar parsear JSON
      let analise;
      try {
        analise = JSON.parse(resposta);
      } catch {
        // Se não for JSON, tentar extrair do texto
        analise = {
          pecaCabivel: 'Análise pendente',
          cabimento: resposta.substring(0, 500),
          minutaRascunho: resposta
        };
      }

      return {
        sucesso: true,
        ...analise
      };
    } catch (erro) {
      console.error('Erro ao analisar com Claude:', erro);
      return {
        sucesso: false,
        erro: erro.message,
        pecaCabivel: 'Erro na análise',
        cabimento: '',
        minutaRascunho: ''
      };
    }
  }
};
