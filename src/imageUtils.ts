import fs from 'fs/promises';
import path from 'path';

export async function loadImageAsBase64(imagePath: string): Promise<string> {
  try {
    const absPath = path.resolve(imagePath);
    const data = await fs.readFile(absPath);
    return data.toString('base64');
  } catch (err: any) {
    throw new Error('No se pudo leer la imagen: ' + err.message);
  }
}
