from flask import Flask, jsonify, request
import gensim
import gensim.downloader

# Load Model, is already stored locally
# https://github.com/RaRe-Technologies/gensim-data#models
google_news_vectors = gensim.downloader.load('word2vec-google-news-300')

# Create FLASK app
app = Flask(__name__)

# Example Call http://127.0.0.1:5000/similarity?word_x=test&word_y=testing
@app.route('/similarity', methods=['GET'])
def word2vec():
    word_x = request.args['word_x']
    word_y = request.args['word_y']

    return jsonify({
        "word_x": word_x,
        "word_y": word_y,
        "similarity": str(google_news_vectors.similarity(word_x, word_y))
    })

if __name__ == '__main__':
    app.run(debug=True)