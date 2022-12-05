require('dotenv').config({ path: '.env' });
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const fetch = require('node-fetch');

const matchMaking = {};

matchMaking.match = function match(psychologists, document) {
  return new Promise(function (resolve, reject) {

    const API = config.nlpmodel.API

    let final_output = []
    let requests = []
    // iterate through all psychologists and queyr the NLP model
    psychologists.forEach(psychologist => {
      // only add if keywords exist on both sites
      if (document.keywords_en.length > 0 && psychologist.keywords_en.length > 0) {
        let body = {
          document_keywords: document.keywords_en,
          psychologist_keywords: psychologist.keywords_en
        }

        requests.push({
          "psychologist": psychologist._id.toString(),
          "request": fetch(API + "/similarities", {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
          })
        })
      } else {
        final_output.push({
          "psychologist": psychologist._id.toString(),
          "score": 0
        })
      }
    })

    Promise.all(requests.map(e => e.request))
      .then((responses) => {
        return responses.map(e => e.json())
      })
      .then(responses => {
        return Promise.all(responses).catch(error => { throw new Error('Not able to parse JSON') })
      })
      .then(responses => {
        responses.map((element, i) => {
          console.log("Info: Response from NLP model: Score:" + element.overall_score + " for psychologist: " + requests[i].psychologist);

          final_output.push({
            "psychologist": requests[i].psychologist,
            "score": element.overall_score,
            "most_important_matches": element.most_important_matches
          })
        })
      })
      .then(() => {
        resolve(final_output)
      })
      .catch(error => {
        reject(error)
      })
  })
};

module.exports = matchMaking;
