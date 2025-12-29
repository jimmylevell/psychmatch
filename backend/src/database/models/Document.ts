import mongoose, { Schema } from 'mongoose';

import { IDocument } from '../../types';

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
