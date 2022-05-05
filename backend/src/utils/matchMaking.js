require('dotenv').config({ path: '.env' });
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const fetch = require('node-fetch');

const matchMaking = {};

matchMaking.match = function translate(psychologists, document) {
  return new Promise(function(resolve, reject) {

    const API =  config.nlpmodel.API

    let requests = []
    // iterate through all psychologists and their associated keywords
    psychologists.forEach(psychologist => {
      let body = { 
        document_keywords: document.keywords_en, 
        psychologist_keywords: psychologist.keywords_en 
      }

      requests.push({ 
        "psychologist": psychologist._id.toString(), 
        "request": fetch(API + "/similarities", {
            headers : {
              'Content-Type' : 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
          })
      })
    })

    Promise.all(requests.map(e => e.request))
    .then((responses) => {
      return responses.map(e => e.json())
    })
    .then(responses => {
      return Promise.all(responses)
    })
    .then(responses => {
      let summary = []

      responses.map((element, i) => {
        summary.push({
          "psychologist": requests[i].psychologist,
          "score": element.score
        })
      })

      return summary
    })
    .then((responses) => {
      resolve(responses)
    })
  })
};

module.exports = matchMaking;