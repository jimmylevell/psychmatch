import mongoose, { Schema } from 'mongoose';

import { IPsychologist } from '../../types';

// define schema for psychologist
const psychologistSchema = new Schema<IPsychologist>({
  _id: Schema.Types.ObjectId,
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    sparse: true
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
  }],
  image: {
    type: String
  }
}, {
  collection: 'psychologist',
  timestamps: true
});

export default mongoose.model<IPsychologist>('Psychologist', psychologistSchema);
