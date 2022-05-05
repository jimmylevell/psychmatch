from flask import Flask, jsonify, request
import gensim
import gensim.downloader
import sys

class Logger:
    def __init__(self, filename, output=False):
        self.console = sys.stdout
        self.output = output
        self.file = None
        self.set_file(filename)

    def set_file(self, filename):
        if self.file:
            self.file.flush()
            self.file.close()
        self.file = open(filename, 'w')

    def write(self, message):
        if self.output:
            self.console.write(str(message) + '\n')
        if self.file:
            self.file.write(str(message) + '\n')

    def flush(self):
        self.console.flush()
        if self.file:
            self.file.flush()

logger = Logger("matchmaking.log", output=True)

# Load Model, is already stored locally
# https://github.com/RaRe-Technologies/gensim-data#models
google_news_vectors = gensim.downloader.load('glove-twitter-25')
#google_news_vectors = gensim.downloader.load('word2vec-google-news-300')

# Create FLASK app
app = Flask(__name__)

@app.route('/similarities', methods=['POST'])
def matchMaking():
    # get post data
    jsonData = request.get_json()
    document_keywords = jsonData.get("document_keywords")
    psychologist_keywords = jsonData.get("psychologist_keywords")

    # only return words existing in vector
    def get_list_of_valid_words(list_of_words):
        valid_words = []

        for word in list_of_words:
            if word in google_news_vectors:
                valid_words.append(word)

        return valid_words

    # get existing words in vector
    overall_score_document_psychologist = 0
    document_keywords = get_list_of_valid_words(document_keywords)
    psychologist_keywords = get_list_of_valid_words(psychologist_keywords)

    for document_keyword in document_keywords:
        max_pair_keyword_score = 0
        current_score = 0

        for psychologist_word in psychologist_keywords:
            # the word2vec model provides a cosine similarity function
            current_score = google_news_vectors.similarity(
                document_keyword, psychologist_word)

            # only add new score if it is bigger than max
            if max_pair_keyword_score < current_score:
                max_pair_keyword_score = current_score
                logger.write("New Best pair, doc_keyword: " + document_keyword + ", psych_keyword: " +
                             psychologist_word + ", scoring: max_pair_score: " + str(max_pair_keyword_score))

        # add best match of keyword score to the overall document rating, process next keyword
        overall_score_document_psychologist += max_pair_keyword_score / \
            (len(psychologist_keywords) + 1)

    logger.write("Matching-Score: " + str(overall_score_document_psychologist))

    # return json
    return jsonify({
        "score": str(overall_score_document_psychologist)
    })

# Example Call
# curl -i "http://127.0.0.1:5000/similarity?word_x=test&word_y=testing"
@app.route('/similarity', methods=['GET'])
def word2vec():
    similarity = 0
    word_x = request.args.get('word_x', None)
    word_y = request.args.get('word_y', None)

    # only return similarity if two words given and word is present in model
    if word_x and word_y and word_x in google_news_vectors and word_y in google_news_vectors:
        similarity = str(google_news_vectors.similarity(word_x, word_y))

    return jsonify({
        "word_x": word_x,
        "word_y": word_y,
        "similarity": similarity
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)