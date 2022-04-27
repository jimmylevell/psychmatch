import gensim
import gensim.downloader

# https://github.com/RaRe-Technologies/gensim-data#models
google_news_vectors = gensim.downloader.load('word2vec-google-news-300')