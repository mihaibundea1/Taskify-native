import { getGeminiModel } from '../config/gemini';

export const aiService = {
  decomposeTask: async (taskTitle, taskDescription, date) => {
    try {
      const model = await getGeminiModel();
      
      const prompt = `Descompune următoarea sarcină în subtask-uri logice cu timeline-uri sugerate pentru data ${date}:
      Titlu: ${taskTitle}
      Descriere: ${taskDescription}
      
      Răspunde doar cu un array JSON în următorul format, fără alte explicații:
      [
        {
          "title": "Subtask 1",
          "suggestedTime": "HH:mm",
          "description": "Descriere opțională"
        }
      ]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = await response.text();
      
      // Curățăm textul de caractere potențial problematice
      text = text.trim();
      // Eliminăm caractere backtick sau alte delimitatoare comune
      text = text.replace(/^`+|`+$/g, '');
      // Eliminăm "json" sau alte etichete de la început
      text = text.replace(/^(json|JSON)\s*/, '');
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Eroare la parsarea JSON:', text);
        throw new Error('Răspunsul AI nu este în format JSON valid');
      }
    } catch (error) {
      console.error('Eroare la generarea subtask-urilor:', error);
      throw error;
    }
  }
};
