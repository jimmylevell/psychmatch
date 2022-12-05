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
})

module.exports = mongoose.model('Document', documentSchema)
