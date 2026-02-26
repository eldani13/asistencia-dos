import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();


const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Falta GEMINI_API_KEY en el .env');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeImage(imageBase64: string, prompt: string) {
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });


  const systemPrompt = `
Analiza la imagen y responde SOLO con este JSON:
{
  "hasPerson": boolean,
  "hasNumbers": boolean,
  "numbersDetected": string[],
  "temperature": string | null
}
Reglas:
- Busca en la imagen un termómetro o medidor de temperatura.
- Identifica qué tipo de indicador es (analógico con aguja, digital, u otro).
- Determina cómo se representa la lectura (aguja sobre escala, números digitales, u otro método).
- Si es analógico, observa cuidadosamente la posición exacta de la aguja respecto a las marcas numéricas visibles y determina el valor exacto mostrado basándote únicamente en lo observable.
- Si es digital, toma el número visible exactamente como aparece.
- Responde SOLO el número exacto que muestra el medidor (sin símbolos, letras ni unidades, solo dígitos) en el campo "temperature" como string.
- Si no hay termómetro o no se puede determinar un valor exacto visible, responde con null en "temperature".
- hasPerson, hasNumbers y numbersDetected funcionan igual que antes.
- Sin texto adicional
- Sin campos extra
`;

  const result = await model.generateContent([
    { text: systemPrompt + '\n' + prompt },
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    },
  ]);

  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No se encontró JSON');

  return JSON.parse(jsonMatch[0]);
}