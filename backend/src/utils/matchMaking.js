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
            console.log(API + "/similarity" + '?word_x=' + keyword + '&word_y=' + document_keyword)
            requests.push({ "psychologist": psychologist._id, "request": fetch(API + "/similarity" + '?word_x=' + decodeURI(keyword) + '&word_y=' + decodeURI(document_keyword))})
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

      return summary
    })
    .then((responses) => {
      let output = []
      Object.keys(responses).forEach(element => {
        console.log(responses[element])
        output.push({
          psychologist_id: element,
          matched_keywords: responses[element],
          match_score: responses[element].reduce((a, b) => a + parseFloat(b.score), 0)
        })
      })

      return output
    })
    .then((responses) => {
      resolve(responses)
    })
  })
};

module.exports = matchMaking;