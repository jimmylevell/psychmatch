# get only words which are in master list
def get_list_of_existing_words(list_of_words, master_list_of_words):
    existing_words = []

    for word in list_of_words:
        word = word.lower()
        if word in master_list_of_words:
            existing_words.append(word)

    return existing_words


def load_nlp_model():
    import os
    import gensim.downloader

    env = os.environ.get('NODE_ENV')

    # Load Model, is already stored locally
    # https://github.com/RaRe-Technologies/gensim-data#models

    # take for development smaller model
    if env == 'production':
        model_name = 'word2vec-google-news-300'
    else:
        model_name = 'glove-twitter-25'

    return gensim.downloader.load(model_name)
