require('dotenv').config({ path: '.env' });
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const fetch = require('node-fetch');

const deepl = {};

// translate text from Source to Destination language using Deepl API
deepl.translate = function translate(text, sourceLang, targetLang) {
  const API = config.deepl.API
  const auth_key = config.deepl.KEY
  const body = 'auth_key=' + auth_key + '&text=' + text + '&target_lang=' + targetLang + '&source_lang=' + sourceLang

  console.log("Info: Translating text from " + sourceLang + " to " + targetLang);

  return fetch(API, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length
    },
    method: 'POST',
    body: body
  })
    .then(res => {
      return res.json()
    })
    .catch(err => {
      console.error(err)
    })
};

module.exports = deepl;
