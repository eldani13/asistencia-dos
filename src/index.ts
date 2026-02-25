import dotenv from 'dotenv';
dotenv.config();

import { analyzeImage } from './gemini';
import { loadImageAsBase64 } from './imageUtils';

async function main() {
  const [,, imagePath, ...promptParts] = process.argv;
  if (!imagePath) {
    console.error('Error: Debes indicar la ruta de la imagen.');
    process.exit(1);
  }
  const prompt = promptParts.join(' ') || 'Detecta si hay personas y números en la imagen.';

  try {
    const imageBase64 = await loadImageAsBase64(imagePath);
    const result = await analyzeImage(imageBase64, prompt);
    // Validar y mostrar solo el JSON requerido
    if (
      typeof result.hasPerson === 'boolean' &&
      typeof result.hasNumbers === 'boolean' &&
      Array.isArray(result.numbersDetected)
    ) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      throw new Error('La respuesta del modelo no tiene el formato esperado.');
    }
  } catch (err: any) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
