import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import fetch from 'node-fetch';
const deepl_key = process.env.DEEPL_KEY || '';

interface TranslateResponse {
  translations: Array<{ text: string }>;
}

export async function translate(text: string, source_lang: string, target_lang: string): Promise<TranslateResponse> {
  const url = 'https://api-free.deepl.com/v2/translate';
  
  const params = new URLSearchParams({
    auth_key: deepl_key,
    text: text,
    source_lang: source_lang,
    target_lang: target_lang
  });

  const response = await fetch(url, {
    method: 'POST',
    body: params
  });

  return response.json() as Promise<TranslateResponse>;
}
