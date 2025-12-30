import fetch from 'node-fetch';
import configs from '../config/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const keyword_extractor = require("keyword-extractor");

const env = (process.env.NODE_ENV || 'development') as keyof typeof configs;
const configEnv = configs[env];

export async function extractLanguageModel(text: string): Promise<string[]> {
  const API = configEnv.nlpmodel.API
  const body = {
    content: text,
  }
  const response = await fetch(API + "/keywords", {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  });
  const result = await response.json();
  return [...new Set(result as string[])];
}

export function extractRake(text: string, language?: string): string[] {
  const keywords = keyword_extractor.extract(text, {
    language: language || "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  });
  return keywords;
}
