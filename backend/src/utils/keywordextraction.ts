import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
import fetch from 'node-fetch';
const keyword_extractor = require("keyword-extractor");

export async function extractLanguageModel(text: string): Promise<string[]> {
  const API = config.nlpmodel.API
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
