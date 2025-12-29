import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fetch from 'node-fetch';

const deepl_key = process.env.DEEPL_API_KEY || '';

interface TranslateResponse {
  translations: Array<{ text: string }>;
}

export async function translate(text: string, source_lang: string, target_lang: string): Promise<TranslateResponse> {
  const url = 'https://api-free.deepl.com/v2/translate';

  const params = new URLSearchParams({
    text: text,
    source_lang: source_lang,
    target_lang: target_lang
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${deepl_key}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`DeepL API error (${response.status}): ${errorBody}`);
  }

  return response.json() as Promise<TranslateResponse>;
}
