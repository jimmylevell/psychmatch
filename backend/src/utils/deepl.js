require('dotenv').config({ path: '.env' });
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const fetch = require('node-fetch');

const deepl = {};

// translate text from Source to Destination language using Deepl API
deepl.translate = function translate(text, sourceLang, targetLang) {
  const API =  config.deepl.API
  const auth_key = config.deepl.KEY

  console.log("Info: Translating text from " + sourceLang + " to " + targetLang);

  return fetch(API + '?auth_key=' + auth_key + '&text=' + text + '&target_lang=' + targetLang + '&source_lang=' + sourceLang)
  .then(res => {
    return res.json()
  })
  .catch(err => {
    console.error(err)
  })
};

module.exports = deepl;