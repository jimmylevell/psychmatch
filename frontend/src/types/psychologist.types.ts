export interface Psychologist {
  _id: string;
  name: string;
  email?: string;
  website: string;
  keywords_cz: string[];
  keywords_en: string[];
  proposed_keywords: string[];
  translate_keywords: boolean;
  image?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface PsychologistResponse {
  psychologist: Psychologist;
}

export interface PsychologistsResponse {
  psychologists: Psychologist[];
}

