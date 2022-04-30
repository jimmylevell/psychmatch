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
      // iterate through all keywords of the psychologist
      psychologist.keywords_en.forEach(keyword => {
          // iterate through all keywords of the document
          document.keywords_en.forEach(document_keyword => {
            // word_x = psychologist keyword
            // word_y = document keyword
            requests.push({ "psychologist": psychologist.name, "request": fetch(API + "/similarity" + '?word_x=' + keyword + '&word_y=' + document_keyword)})
          })
      })
    })

    let summary = []
    Promise.all(requests.map(e => e.request))
    .then((responses) => {
      return responses.map(e => e.json())
    })
    .then(responses => {
      return Promise.all(responses)
    })
    .then(responses => {
      responses.map((element, i) => {
        // create a new element for every psychologist with all matched keywords
        if(summary[requests[i].psychologist]) {
          summary[requests[i].psychologist].push({
            psychologist_keyword: element.word_x,
            document_keyword: element.word_y,
            score: element.similarity
          })
        } else {
          summary[requests[i].psychologist] = [ {
            psychologist_keyword: element.word_x,
            document_keyword: element.word_y,
            score: element.similarity
          }]
        }
      })
    })
    .then(() => {
      resolve(summary)
    })
  })
};

module.exports = matchMaking;