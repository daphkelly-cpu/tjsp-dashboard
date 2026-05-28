import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const pdfService = {
  async extrairTexto(arquivo) {
    try {
      if (!arquivo || !arquivo.type.includes('pdf')) {
        throw new Error('Arquivo deve ser um PDF válido');
      }

      const arrayBuffer = await arquivo.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

      let textoCompleto = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textoPage = textContent.items.map(item => item.str).join(' ');
        textoCompleto += textoPage + '\n';
      }

      return {
        texto: textoCompleto,
        nomePDF: arquivo.name,
        tamanho: arquivo.size,
        sucesso: true
      };
    } catch (erro) {
      console.error('Erro ao extrair PDF:', erro);
      return {
        sucesso: false,
        erro: erro.message,
        nomePDF: arquivo?.name
      };
    }
  },

  async extrairDePDF(pdfData) {
    try {
      // Suporta:
      // 1. ArrayBuffer direto
      // 2. Base64 string (convertido para ArrayBuffer)
      // 3. Uint8Array
      let arrayBuffer;

      if (typeof pdfData === 'string') {
        // Base64 string
        const binaryString = atob(pdfData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        arrayBuffer = bytes.buffer;
      } else if (pdfData instanceof ArrayBuffer) {
        arrayBuffer = pdfData;
      } else if (pdfData instanceof Uint8Array) {
        arrayBuffer = pdfData.buffer;
      } else {
        throw new Error('Tipo de dados PDF não suportado');
      }

      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let textoCompleto = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textoPage = textContent.items.map(item => item.str).join(' ');
        textoCompleto += textoPage + '\n';
      }

      return {
        texto: textoCompleto,
        sucesso: true
      };
    } catch (erro) {
      console.error('Erro ao extrair PDF (Supabase):', erro);
      return {
        sucesso: false,
        erro: erro.message
      };
    }
  }
};
