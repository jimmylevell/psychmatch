# get only words which are in master list
import os


def get_list_of_existing_words(list_of_words, master_list_of_words):
    existing_words = []

    for word in list_of_words:
        word = word.lower()
        if word in master_list_of_words:
            existing_words.append(word)

    return existing_words


def load_nlp_model(env=os.environ.get('NODE_ENV')):
    import gensim.downloader

    # Load Model, is already stored locally
    # https://github.com/RaRe-Technologies/gensim-data#models

    # take for development smaller model
    if env == 'production':
        print("Loading production nlp model")
        model_name = 'word2vec-google-news-300'
    else:
        print("Loading dev nlp model")
        model_name = 'glove-twitter-25'

    return gensim.downloader.load(model_name)
