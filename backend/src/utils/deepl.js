require('dotenv').config({ path: '.env' });
const config = require('config');
const fetch = require('node-fetch');
const dockerSecret = require('./dockerSecret.js');

const deepl = {};

// translate text from Source to Destination language using Deepl API
deepl.translate = function translate(text, sourceLang, targetLang) {
  const API =  config.get("deepl.API")
  let auth_key = process.env.DEEPL_API_KEY
  if (process.env.NODE_ENV === "production") {
    auth_key = dockerSecret.read('DEEPL_API_KEY');
  }

  return fetch(API + '?auth_key=' + auth_key + '&text=' + text + '&target_lang=' + targetLang + '&source_lang=' + sourceLang)
  .then(res => {
    return res.json()
  })
};

module.exports = deepl;