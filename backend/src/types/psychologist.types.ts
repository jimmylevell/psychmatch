import mongoose, { Document as MongooseDocument } from 'mongoose';

export interface IPsychologist extends MongooseDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  website: string;
  keywords_cz: string[];
  keywords_en: string[];
  proposed_keywords: string[];
  translate_keywords?: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
