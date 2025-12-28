import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

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

// define schema for documents
const documentSchema = new Schema<IDocument>({
  _id: Schema.Types.ObjectId,
  content_cz: {
    type: String
  },
  content_en: {
    type: String
  },
  keywords_cz: [{
    type: String
  }],
  keywords_en: [{
    type: String
  }],
  matched_psychologists: [{
    psychologist: String,
    score: Number,
    most_important_matches: [{
      document_keyword: String,
      psychologist_keyword: String,
      score: Number
    }]
  }],
}, {
  collection: 'documents',
  timestamps: true
});

export default mongoose.model<IDocument>('Document', documentSchema);
