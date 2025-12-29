import mongoose, { Document as MongooseDocument } from 'mongoose';

export interface IMatch {
  document_keyword: string;
  psychologist_keyword: string;
  score: number;
}

export interface IMatchedPsychologist {
  psychologist: string;
  score: number;
  most_important_matches: IMatch[];
}

export interface IDocument extends MongooseDocument {
  _id: mongoose.Types.ObjectId;
  content_cz: string;
  content_en: string;
  keywords_cz: string[];
  keywords_en: string[];
  matched_psychologists: IMatchedPsychologist[];
  createdAt?: Date;
  updatedAt?: Date;
}
