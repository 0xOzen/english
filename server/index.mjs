import { config as loadDotenv } from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

loadDotenv({ path: path.join(rootDir, '.env.local') });
loadDotenv();

const port = Number(process.env.PORT || 8787);
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const imageModel = process.env.NANO_BANANA_MODEL || 'gemini-3.1-flash-image-preview';
const allowedModels = new Set([
  'gemini-3.1-flash-image-preview',
  'gemini-2.5-flash-image',
  'gemini-3-pro-image-preview',
]);

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasApiKey: Boolean(apiKey),
    model: imageModel,
  });
});

app.post('/api/ai/image-mnemonic', async (req, res) => {
  if (!apiKey) {
    res.status(500).json({
      error: 'Missing GEMINI_API_KEY or GOOGLE_API_KEY on the server.',
    });
    return;
  }

  const term = String(req.body?.term || '').trim();
  const translation = String(req.body?.translation || '').trim();
  const aspectRatio = String(req.body?.aspectRatio || '1:1');
  const requestedModel = String(req.body?.model || imageModel);
  const activeModel = allowedModels.has(requestedModel) ? requestedModel : imageModel;

  if (!term) {
    res.status(400).json({ error: 'Term is required.' });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Create a highly descriptive, visually memorable mnemonic illustration for the English term or phrase "${term}". Turkish meaning: "${translation}". Keep it image-first, useful for B2-C1 vocabulary recall, and avoid large blocks of text in the image.`;

    const response = await ai.models.generateContent({
      model: activeModel,
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        res.json({
          imageUrl: `data:image/png;base64,${part.inlineData.data}`,
          model: activeModel,
        });
        return;
      }
    }

    res.status(502).json({ error: 'No image was returned by the model.' });
  } catch (error) {
    console.error('Image generation failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown image generation error',
    });
  }
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }

    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`English Deck API listening on http://localhost:${port}`);
});
