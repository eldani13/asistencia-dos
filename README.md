# Gemini Image Analyzer

Este proyecto es una herramienta en Node.js + TypeScript para analizar imágenes usando la API de Google AI Studio (Gemini). Permite detectar personas y números visibles en imágenes, devolviendo siempre un JSON estructurado. Ahora incluye una API REST lista para usar.

## Requisitos

- Node.js >= 18
- npm
- Cuenta en Google AI Studio y una API Key de Gemini

## Instalación

1. **Clona este repositorio o copia los archivos en una carpeta nueva.**
2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura tu archivo `.env`:**

   - Copia `.env.example` a `.env` y coloca tu API Key de Gemini.

   ```bash
   cp .env.example .env
   # Edita .env y agrega tu API Key
   ```

## Uso como API REST

1. **Inicia el servidor:**

   ```bash
   npm run dev
   # o
   npm start
   ```

2. **Endpoint principal para analizar imágenes:**

   - **POST** `/api/image/analyze`
   - Formato: `multipart/form-data`
   - Campos:
     - `image`: archivo de imagen (obligatorio)
     - `prompt`: texto adicional para el análisis (opcional)

### Ejemplo con Postman

1. Selecciona método POST y URL: `http://localhost:3000/api/image/analyze`
2. En la pestaña Body, elige `form-data`.
3. Agrega un campo `image` de tipo File y selecciona tu imagen.
4. (Opcional) Agrega un campo `prompt` de tipo Text.
5. Haz clic en Send.

### Ejemplo con curl

```bash
curl -X POST http://localhost:3000/api/image/analyze -F "image=@ruta/a/tu/imagen.jpg"
```

### Ejemplo de respuesta

```json
{
  "hasPerson": true,
  "hasNumbers": true,
  "numbersDetected": ["12", "2024"]
}
```

## Uso por línea de comandos (CLI)

También puedes ejecutar el análisis desde la terminal:

```bash
npm start -- <ruta_imagen> "<prompt opcional>"
```

- `<ruta_imagen>`: Ruta local de la imagen a analizar (obligatorio)
- `<prompt opcional>`: Texto adicional para el análisis (opcional)

## Posibles casos de uso

- Control de acceso con detección de personas y números
- Extracción de información de imágenes de documentos
- Automatización de análisis visual en sistemas de vigilancia

## Notas

- El modelo usado por defecto es `gemini-1.5-flash` o el que configures en `.env`.
- La respuesta SIEMPRE será un JSON válido con la estructura especificada.

---

**¡Listo para usar! Solo necesitas tu API Key y una imagen.**
