require('dotenv').config({ path: '.env' });
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const fetch = require('node-fetch');
const keyword_extractor = require("keyword-extractor");
const keywordextraction = {};

// using language model for keyword extraction
keywordextraction.extractLanguageModel = function extract(text) {
  const API =  config.nlpmodel.API
  const body = {
    content: text,
  }
  return fetch(API + "/keywords", {
    headers : {
      'Content-Type' : 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  })
  .then(res => {
    return res.json()
  })
  .catch(err => {
    console.error(err)
  })
};

// using rake as keyword extraction
keywordextraction.extractRake = function extract(text) {
  keywords = keyword_extractor.extract(text, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  });

  return keywords;
}

module.exports = keywordextraction;