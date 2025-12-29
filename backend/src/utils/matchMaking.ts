import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import config from '../../config/config';
const env = (process.env.NODE_ENV || 'development') as keyof typeof config;

const configEnv = config[env];

interface Psychologist {
  keywords_en: string[];
}

interface Document {
  keywords_en: string[];
}

export async function match(psychologists: Psychologist[], document: Document): Promise<any[]> {
  const API = configEnv.nlpmodel.API;
  const document_keywords = document.keywords_en;

  let final_output: any[] = [];
  let requests: Promise<any>[] = [];

  psychologists.forEach(psychologist => {
    const body = {
      document_keywords: document_keywords,
      psychologist_keywords: psychologist.keywords_en,
    };

    console.log(API)
    const request = fetch(API + "/similarities", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(result => {
        return result;
      });

    requests.push(request);
  });

  try {
    console.log("Matching document with " + psychologists.length + " psychologist(s). Waiting for " + requests.length + " request(s) to finish.");
    const results = await Promise.all(requests);
    results.forEach((result, index) => {
      final_output.push(result);
    });
  } catch (err) {
    console.error("Error matching document with psychologists: " + err);
  }

  return final_output;
}
