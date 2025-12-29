import fetch from 'node-fetch';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: '.env' });

import config from '../../config/config';
import { IMatchedPsychologist } from '../types';
const env = (process.env.NODE_ENV || 'development') as keyof typeof config;

const configEnv = config[env];

interface Psychologist {
  _id: mongoose.Types.ObjectId;
  keywords_en: string[];
}

interface Document {
  keywords_en: string[];
}

export async function match(psychologists: Psychologist[], document: Document): Promise<IMatchedPsychologist[]> {
  const API = configEnv.nlpmodel.API;
  const document_keywords = document.keywords_en;

  let final_output: any[] = [];
  let requests: Promise<any>[] = [];

  psychologists.forEach(psychologist => {
    const body = {
      document_keywords: document_keywords,
      psychologist_keywords: psychologist.keywords_en,
    };

    const request = fetch(API + "/similarities", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(result => {
        return convertNumpyFloatsToNumbers(result);
      });

    requests.push(request);
  });

  try {
    console.log("Matching document with " + psychologists.length + " psychologist(s). Waiting for " + requests.length + " request(s) to finish.");
    const results = await Promise.all(requests);
    results.forEach((result, index) => {
      final_output.push({
        psychologist: psychologists[index]._id.toString(),
        score: result.overall_score || 0,
        most_important_matches: result.most_important_matches || []
      });
    });
  } catch (err) {
    console.error("Error matching document with psychologists: " + err);
  }

  return final_output;
}

// Helper function to recursively convert numpy float strings to numbers
function convertNumpyFloatsToNumbers(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // Check if string matches numpy float pattern: np.float32(...) or np.float64(...)
    const numpyFloatMatch = obj.match(/^np\.float(?:32|64)\(([-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)\)$/);
    if (numpyFloatMatch) {
      return parseFloat(numpyFloatMatch[1]);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertNumpyFloatsToNumbers(item));
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = convertNumpyFloatsToNumbers(obj[key]);
      }
    }
    return converted;
  }

  return obj;
}
