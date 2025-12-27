import { randomUUID } from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function analyzeMessage(input: {
  leadMessage: string;
  sellerLastMessage?: string;
}) {
  try {
    return await callGemini(input);
  } catch (err) {
    console.error('[Gemini] primary failed', err);

    try {
      return await callGemini(input, true); // retry simplificado
    } catch (err2) {
      console.error('[Gemini] retry failed', err2);
      return fallbackResponse();
    }
  }
}

async function callGemini(input: any, simplified = false) {
  const prompt = simplified
    ? buildSimplifiedPrompt(input)
    : buildPrompt(input);

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('INVALID_JSON');
  }

  return {
    analysisId: randomUUID(),
    detectedIntent: parsed.detectedIntent ?? 'unknown',
    strategies: parsed.strategies.map((s: any) => ({
      id: s.id,
      label:
        s.id === 'relational'
          ? 'Relacional'
          : s.id === 'educational'
          ? 'Educacional'
          : 'Fechamento',
      text: s.text
    }))
  };
}

function buildPrompt(input: any) {
  return `
${SYSTEM_PROMPT}

Mensagem do cliente:
"${input.leadMessage}"

Última mensagem do vendedor:
"${input.sellerLastMessage ?? 'Não informado'}"

Responda SOMENTE em JSON válido:

{
  "detectedIntent": "price_objection | interest | doubt | stalling | closing_signal | unknown",
  "strategies": [
    { "id": "relational", "text": "..." },
    { "id": "educational", "text": "..." },
    { "id": "closing", "text": "..." }
  ]
}
`.trim();
}

function buildSimplifiedPrompt(input: any) {
  return `
Mensagem do cliente:
"${input.leadMessage}"

Gere 3 respostas curtas para WhatsApp:
- Relacional
- Educacional
- Fechamento

Formato JSON obrigatório:

{
  "detectedIntent": "unknown",
  "strategies": [
    { "id": "relational", "text": "..." },
    { "id": "educational", "text": "..." },
    { "id": "closing", "text": "..." }
  ]
}
`.trim();
}

function fallbackResponse() {
  return {
    analysisId: crypto.randomUUID(),
    detectedIntent: 'unknown',
    strategies: [
      {
        id: 'relational',
        label: 'Relacional',
        text: 'Entendo 🙂 Me conta um pouco mais do que você precisa pra eu te ajudar melhor.'
      },
      {
        id: 'educational',
        label: 'Educacional',
        text: 'Posso te explicar rapidinho como funciona e ver se faz sentido pra você.'
      },
      {
        id: 'closing',
        label: 'Fechamento',
        text: 'Se preferir, a gente pode avançar agora e ajustar qualquer detalhe depois.'
      }
    ]
  };
}

const SYSTEM_PROMPT = `
Você é um mentor de vendas para WhatsApp.
Respostas curtas, humanas e orientadas à conversão.
Nunca explique nada.
Nunca saia do JSON.
`.trim();

