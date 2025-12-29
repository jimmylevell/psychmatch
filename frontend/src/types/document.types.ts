import { Match, MatchedPsychologist } from './common.types';

export interface Document {
  _id: string;
  content_cz: string;
  content_en: string;
  keywords_cz: string[];
  keywords_en: string[];
  matched_psychologists: MatchedPsychologist[];
  updatedAt: string;
  createdAt: string;
}

export interface DocumentResponse {
  document: Document;
}

export interface DocumentsResponse {
  documents: Document[];
}
