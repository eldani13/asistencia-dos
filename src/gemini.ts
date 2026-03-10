import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Falta GEMINI_API_KEY en el .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeImage(imageBase64: string) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0,
      topK: 1,
      topP: 0,
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          tipo: {
            type: SchemaType.STRING,
            description: "¿Es digital o analógico?",
          },
          escala_leida: {
            type: SchemaType.STRING,
            description:
              "Si tiene doble escala, indica cuál estás leyendo (ej. la exterior grande, o la interior pequeña).",
          },
          numero_visible_anterior: {
            type: SchemaType.STRING,
            description:
              "El número grande impreso que está justo ANTES de la aguja.",
          },
          numero_visible_siguiente: {
            type: SchemaType.STRING,
            description:
              "El número grande impreso que está justo DESPUÉS de la aguja.",
          },
          calculo_rayitas: {
            type: SchemaType.STRING,
            description:
              "Explica la matemática: ¿Cuántas rayitas hay después del número anterior y cuánto vale cada rayita?",
          },
          temperature: {
            type: SchemaType.STRING,
            description: "El resultado numérico final exacto.",
            nullable: true,
          },
        },
        required: [
          "tipo",
          "escala_leida",
          "numero_visible_anterior",
          "numero_visible_siguiente",
          "calculo_rayitas",
          "temperature",
        ],
      },
    },
  });

  const systemPrompt = `
Eres un sistema de visión artificial calibrado para lectura de medidores. No adivines. Calcula.

Reglas INQUEBRANTABLES:
1. Localiza la pantalla o la esfera del termómetro.
2. SI ES DIGITAL: Lee el número principal de la pantalla y pon "N/A" en los campos de números anteriores/siguientes.
3. SI ES ANALÓGICO:
   - Fíjate a dónde apunta exactamente la PUNTA de la aguja.
   - Si hay dos escalas (ej. C y F), elige la escala donde los números sean MÁS GRANDES y claros (generalmente la exterior).
   - Identifica el número impreso que la aguja acaba de pasar (numero_visible_anterior).
   - Identifica el próximo número impreso (numero_visible_siguiente).
   - Cuenta las marcas entre esos dos números para saber de cuánto en cuánto va la escala (ej. ¿va de 2 en 2? ¿de 1 en 1?).
   - Suma el valor de las rayitas al "numero_visible_anterior" para obtener el valor real.
   - Si la punta señala EXACTAMENTE encima de un número impreso, la temperatura es ese número.
4. El campo 'temperature' debe contener SOLO el número final en dígitos.
`;

  const result = await model.generateContent([
    { text: systemPrompt },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    },
  ]);

  const text = result.response.text();
  const jsonCompleto = JSON.parse(text);

  // console.log("Auditoría de IA:", jsonCompleto);

  return {
    temperature: jsonCompleto.temperature,
  };
}
