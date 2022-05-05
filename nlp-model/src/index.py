from flask import Flask, jsonify, request
import os
from logger import Logger
from utils import load_nlp_model, get_list_of_existing_words
from Score import Score
from Result import Result

logger = Logger("matchmaking.log", output=True)
env = os.environ.get('NODE_ENV')
nlp_model = load_nlp_model()

# Create FLASK app
app = Flask(__name__)


@app.route('/similarities', methods=['POST'])
def matchMaking():
    most_important_matches = []
    result = Result()

    # get post data
    jsonData = request.get_json()
    document_keywords = jsonData.get("document_keywords")
    psychologist_keywords = jsonData.get("psychologist_keywords")

    # get existing words in vector
    document_keywords = get_list_of_existing_words(
        document_keywords, nlp_model)
    psychologist_keywords = get_list_of_existing_words(
        psychologist_keywords, nlp_model)

    for document_keyword in document_keywords:
        max_pair = Score()
        current_score = 0

        for psychologist_keyword in psychologist_keywords:
            # the word2vec model provides a cosine similarity function
            current_score = nlp_model.similarity(
                document_keyword, psychologist_keyword)

            # only add new score if it is bigger than max
            if max_pair.score < current_score:
                max_pair.document_keyword = document_keyword
                max_pair.psychologist_keyword = psychologist_keyword
                max_pair.score = current_score

                logger.write("New best pair, doc_keyword: " + max_pair.document_keyword + ", psych_keyword: " +
                             max_pair.psychologist_keyword + ", scoring: max_pair_score: " + str(max_pair.score))

        # add best match of keyword score to the overall document rating, process next keyword
        most_important_matches.append(max_pair)
        result.overall_score += max_pair.score

    result.most_important_matches = most_important_matches
    result.overall_score = result.overall_score / \
        len(result.most_important_matches)
    logger.write("Matching-Score: " + str(result.overall_score))

    # return json
    return result.toJSON()

# Example Call
# curl -i "http://127.0.0.1:5000/similarity?word_x=test&word_y=testing"


@app.route('/similarity', methods=['GET'])
def word2vec():
    similarity = 0
    word_x = request.args.get('word_x', None)
    word_y = request.args.get('word_y', None)

    # only return similarity if two words given and word is present in model
    if word_x and word_y and word_x in nlp_model and word_y in nlp_model:
        similarity = str(nlp_model.similarity(word_x, word_y))

    return Result(overall_score=similarity,
                  most_important_matches=Score(document_keyword=word_x, psychologist_keyword=word_y, score=similarity)).toJSON()


@app.errorhandler(404)
def page_not_found(e):
    return "<h1>404</h1><p>The resource could not be found.</p>", 404


if __name__ == '__main__':
    if env == 'production':
        app.run(host='0.0.0.0', debug=False)
    else:
        app.run(host='0.0.0.0', debug=True)
