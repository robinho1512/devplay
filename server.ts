import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // API 1: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API 2: Gemini AI Tutor Q&A Endpoint
  app.post('/api/ask-tutor', async (req, res) => {
    const { title, content, language } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY is not defined. Falling back to structured sandbox response.');
        return res.json({
          answer: `### Olá! Eu sou o **Tutor de Programação do DevLingo**! 👋\n\nNossa API do Gemini está em modo de sandbox de segurança porque nenhuma chave \`GEMINI_API_KEY\` foi configurada nos segredos do seu workspace ainda.\n\nContudo, analisando sua dúvida sobre **"${title}"**, aqui estão algumas dicas gerais de ${language || 'código'}:\n1. **Pratique bastante**: Tente reescrever a linha de código manualmente ao invés de copiar.\n2. **Teste por partes**: Isole o problema em pedaços pequenos de código.\n3. **Cuidado com a sintaxe**: Verifique as chaves \`{}\` ou parênteses vazios.\n\n*Configure sua chave de API nos Segredos do AI Studio para ativar as respostas de IA completas!*`
        });
      }

      // Initialize GoogleGenAI according to required system_skills standards (telemetry client headers)
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const sysInstruction = "Você é o instrutor e tutor de desenvolvimento líder na plataforma gamificada DevLingo. " +
        "Seu objetivo é sanar dúvidas de alunos sobre HTML, CSS, JavaScript, TypeScript ou Python de forma extremamente acolhedora, " +
        "explicativa e profissional. Use trechos de código em markdown para ilustrar suas respostas.";

      const promptMsg = `Estudante enviou uma dúvida no tópico do fórum da comunidade de DevLingo:\nTítulo: "${title}"\nCódigo ou Detalhes: "${content}"\nLinguagem de contexto: ${language || 'Desconhecida'}\n\nPor favor, escreva uma resposta instrutiva em markdown auxiliando este aluno.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptMsg,
        config: {
          systemInstruction: sysInstruction,
          temperature: 0.7,
        }
      });

      const responseText = aiResponse.text || "Desculpe, não consegui processar a resposta no momento.";
      return res.json({ answer: responseText });

    } catch (error: any) {
      console.error('Error generating tutor response:', error);
      return res.status(500).json({ 
        error: 'Incapaz de obter auxílio do IA', 
        details: error.message 
      });
    }
  });

  // Vite Assets Server routing middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with static serving...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DevLingo Server] Listening and serving details on http://0.0.0.0:${PORT}`);
  });
}

startServer();
