const keyword_extractor = require("keyword-extractor");
const keywordextraction = {};

keywordextraction.extract = function extract(text) {
  keywords =  keyword_extractor.extract(text, {
    language:"english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  });

  return keywords;
};

module.exports = keywordextraction;