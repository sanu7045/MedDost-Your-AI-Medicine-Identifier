import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', apiKey: !!AI_API_KEY }));

const cache = new Map();
const CACHE_TTL = 86400;

function getCacheKey(prefix, data) {
  return `${prefix}:${crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')}`;
}

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCache(key, value, ttl = CACHE_TTL) {
  cache.set(key, { value, expiry: Date.now() + ttl * 1000 });
}

const AI_API_KEY = process.env.GEMINI_API_KEY;
if (!AI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is not set in .env. The backend will reject API requests.');
}

const ai = AI_API_KEY ? new GoogleGenAI({ apiKey: AI_API_KEY }) : null;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    name: { type: "STRING" },
    use: {
      type: "OBJECT",
      properties: {
        english: { type: "STRING" }, hindi: { type: "STRING" },
        bengali: { type: "STRING" }, marathi: { type: "STRING" },
        telugu: { type: "STRING" }, tamil: { type: "STRING" },
        gujarati: { type: "STRING" }, urdu: { type: "STRING" }
      },
      required: ["english", "hindi", "bengali", "marathi", "telugu", "tamil", "gujarati", "urdu"]
    },
    dosage: {
      type: "OBJECT",
      properties: {
        english: { type: "STRING" }, hindi: { type: "STRING" },
        bengali: { type: "STRING" }, marathi: { type: "STRING" },
        telugu: { type: "STRING" }, tamil: { type: "STRING" },
        gujarati: { type: "STRING" }, urdu: { type: "STRING" }
      },
      required: ["english", "hindi", "bengali", "marathi", "telugu", "tamil", "gujarati", "urdu"]
    }
  },
  required: ["name", "use", "dosage"]
};

const IMAGE_PROMPT = `Act as a highly skilled medical assistant. Look at this medicine image and identify it. 
            **CRITICAL INSTRUCTION**: The image might be blurry, poorly lit, grainy, or partially cut off. Use your advanced reasoning and knowledge of pharmaceutical packaging to deduce the medicine name even if only partial letters, logos, or blister pack shapes are visible. If you are reasonably confident, provide the best match.
            Provide its common name, its main use, and a general dosage.
            For 'use' and 'dosage', provide translations in the requested languages. Ensure the language is extremely simple so anyone can easily understand. 
            Add a short safety advice or warning at the end of the 'dosage' field.
            If you are completely unsure or it is NOT a medicine, return empty strings.`;

const TEXT_PROMPT_TEMPLATE = (query) => `Act as a highly skilled medical assistant. The user is asking about a medicine called: "${query}".
            Identify this medicine. Even if the name is slightly misspelled or incomplete, use your knowledge to match it to the closest real medicine.
            Provide its correct common name, its main use, and a general dosage.
            For 'use' and 'dosage', provide translations in the requested languages. Ensure the language is extremely simple so anyone can easily understand. 
            Add a short safety advice or warning at the end of the 'dosage' field.
            If you cannot identify any real medicine from this query, return empty strings.`;

app.post('/api/analyze-image', async (req, res) => {
  if (!ai) return res.status(500).json({ error: 'Server API key not configured' });
  try {
    const { image, prompt, language } = req.body;
    const effectivePrompt = prompt || IMAGE_PROMPT;
    const cacheKey = getCacheKey('img', { image: image || '', prompt: effectivePrompt });
    const cached = getCached(cacheKey);
    if (cached) return res.json({ text: cached });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { mimeType: 'image/jpeg', data: image } },
        { text: effectivePrompt }
      ],
      config: { 
        responseMimeType: "application/json", 
        responseSchema: RESPONSE_SCHEMA 
      }
    });

    const text = response.text;
    setCache(cacheKey, text);
    res.json({ text });
  } catch (err) {
    console.error('API Error:', err);
    if (err.status === 429 || /quota|exceeded/i.test(err.message)) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    }
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

app.post('/api/analyze-query', async (req, res) => {
  if (!ai) return res.status(500).json({ error: 'Server API key not configured' });
  try {
    const { prompt, language } = req.body;
    const cacheKey = getCacheKey('q', { prompt, language });
    const cached = getCached(cacheKey);
    if (cached) return res.json({ text: cached });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
      config: { 
        responseMimeType: "application/json", 
        responseSchema: RESPONSE_SCHEMA 
      }
    });

    const text = response.text;
    setCache(cacheKey, text);
    res.json({ text });
  } catch (err) {
    console.error('API Error:', err);
    if (err.status === 429 || /quota|exceeded/i.test(err.message)) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    }
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

export { app };

const PORT = process.env.PORT || 3001;
if (process.env.NETLIFY !== 'true') {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}
