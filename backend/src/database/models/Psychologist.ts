import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IPsychologist extends MongooseDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  website: string;
  keywords_cz: string[];
  keywords_en: string[];
  proposed_keywords: string[];
  translate_keywords?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// define schema for psychologist
const psychologistSchema = new Schema<IPsychologist>({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  website: {
    type: String
  },
  keywords_cz: [{
    type: String
  }],
  keywords_en: [{
    type: String
  }],
  proposed_keywords: [{
    type: String
  }]
}, {
  collection: 'psychologist',
  timestamps: true
});

export default mongoose.model<IPsychologist>('Psychologist', psychologistSchema);
