import { Router } from 'express';
// Importa aquí las funciones que quieras exponer de gemini.ts
// import { tuFuncion } from '../gemini';

const router = Router();

// Ejemplo de endpoint GET
router.get('/', (req, res) => {
  res.json({ message: 'Endpoint de Gemini funcionando' });
});

// Aquí puedes exponer funciones reales de gemini.ts
// router.post('/procesar', async (req, res) => {
//   const resultado = await tuFuncion(req.body);
//   res.json({ resultado });
// });

export default router;
