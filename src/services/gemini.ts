import { AppState } from '../types';

export type ImageMnemonicResult =
  | { ok: true; imageUrl: string }
  | { ok: false; error: string };

async function generateViaBrowserKey(
  term: string,
  translation: string,
  model: NonNullable<AppState['aiModel']>,
  apiKey: string,
): Promise<ImageMnemonicResult> {
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Create a highly descriptive, visually memorable mnemonic illustration for the English term or phrase "${term}". Turkish meaning: "${translation}". Keep it image-first, useful for B2-C1 vocabulary recall, and avoid large blocks of text in the image.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: '1:1',
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        return {
          ok: true,
          imageUrl: `data:image/png;base64,${part.inlineData.data}`,
        };
      }
    }

    return {
      ok: false,
      error: 'Model görsel dönmedi. Farklı bir model veya farklı bir terim dene.',
    };
  } catch (error) {
    console.error('Browser-key image generation failed:', error);
    return {
      ok: false,
      error: 'Tarayıcı üzerinden AI çağrısı başarısız oldu. API key ve kota durumunu kontrol et.',
    };
  }
}

export async function generateImageMnemonic(
  term: string,
  translation: string,
  model: NonNullable<AppState['aiModel']> = 'gemini-3.1-flash-image-preview',
  browserApiKey = '',
): Promise<ImageMnemonicResult> {
  if (!navigator.onLine) {
    return {
      ok: false,
      error: 'Cihaz şu an çevrimdışı. AI görsel üretimi için internet bağlantısı gerekiyor.',
    };
  }

  if (browserApiKey.trim()) {
    return generateViaBrowserKey(term, translation, model, browserApiKey.trim());
  }

  try {
    const response = await fetch('/api/ai/image-mnemonic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        term,
        translation,
        model,
        aspectRatio: '1:1',
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      return {
        ok: false,
        error: payload.error || 'AI servisi şu anda yanıt veremiyor.',
      };
    }

    const payload = (await response.json()) as { imageUrl?: string };
    if (!payload.imageUrl) {
      return {
        ok: false,
        error: 'Model görsel dönmedi. Farklı bir model veya farklı bir terim dene.',
      };
    }

    return {
      ok: true,
      imageUrl: payload.imageUrl,
    };
  } catch (error) {
    console.error('Failed to generate image:', error);
    return {
      ok: false,
      error: 'AI servisine bağlanırken bir hata oluştu. API sunucusunun çalıştığından emin ol.',
    };
  }
}
