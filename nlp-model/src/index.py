from flask import Flask, jsonify, request
import gensim
import gensim.downloader

# Load Model, is already stored locally
# https://github.com/RaRe-Technologies/gensim-data#models
google_news_vectors = gensim.downloader.load('word2vec-google-news-300')

# Create FLASK app
app = Flask(__name__)

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