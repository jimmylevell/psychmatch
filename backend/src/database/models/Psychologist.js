const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define schema for psychologist
// psychologist consist of id, name, website, keywords
const psychologistSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
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
})

module.exports = mongoose.model('Psychologist', psychologistSchema)