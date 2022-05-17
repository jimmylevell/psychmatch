# get only words which are in master list
import os

# take for development smaller model
NLP_PREFIX = ""

if os.environ.get('NODE_ENV') == 'production':
    # add prefix as production nlp model requires prefix for words
    NLP_PREFIX = "/c/en/"

def get_list_of_existing_words(list_of_words, master_list_of_words):
    import numpy

    existing_words = []

    # split individual words if multiple word keyword has been given
    if len(list_of_words) > 0:
        list_of_words = [ word.split(" ") for word in list_of_words]
        list_of_words = list(numpy.concatenate(list_of_words, axis=0))

        for word in list_of_words:
            word = word.lower()
            if NLP_PREFIX + word in master_list_of_words:
                # word exists in nlp model
                existing_words.append(word)

    return existing_words

def load_nlp_model(env=os.environ.get('NODE_ENV')):
    import gensim.downloader
    import en_core_web_lg
    import nltk

    spacy_model = None
    gensim_model = None

    nltk.download('stopwords')
    nltk.download('punkt')

    # Load Model, is already stored locally
    # https://github.com/RaRe-Technologies/gensim-data#models

    # take for development smaller model
    if env == 'production':
        print("Loading production nlp models")
        gensim_model = gensim.downloader.load('conceptnet-numberbatch-17-06-300')
        spacy_model = en_core_web_lg.load()
    else:
        print("Loading dev nlp model")
        gensim_model = gensim.downloader.load('glove-twitter-25')
        spacy_model = en_core_web_lg.load()

    return gensim_model, spacy_model
