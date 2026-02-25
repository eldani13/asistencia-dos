
import { Router } from 'express';
import multer from 'multer';
import { loadImageAsBase64 } from '../imageUtils';
import { analyzeImage } from '../gemini';


const router = Router();
const upload = multer();


// Ejemplo de endpoint GET
router.get('/', (req, res) => {
  res.json({ message: 'Endpoint de ImageUtils funcionando' });
});

// Endpoint para subir imagen y analizarla
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ninguna imagen' });
    }
    // Convertir buffer a base64
    const imageBase64 = req.file.buffer.toString('base64');
    const prompt = req.body.prompt || '';
    const result = await analyzeImage(imageBase64, prompt);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Aquí puedes exponer funciones reales de imageUtils.ts
// router.post('/procesar', async (req, res) => {
//   const resultado = await tuFuncion(req.body);
//   res.json({ resultado });
// });

export default router;
