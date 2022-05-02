const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define schema for documents 
// document consist of id, 
const documentSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content_cz: {
    type: String
  },
  content_en: {
    type: String
  },
  keywords_cz: {
    type: Array
  },
  keywords_en: {
    type: Array
  },
  matched_psychologists: [
    {
      psychologist_id: String,
      matched_keywords: Array,
      match_score: Number
    }
  ],
}, {
  collection: 'documents',
  timestamps: true
})

module.exports = mongoose.model('Document', documentSchema)