#!/bin/bash

# Download models on first run if they don't exist
if [ ! -d "/root/gensim-data" ] || [ ! -d "/usr/local/lib/python3.12/site-packages/en_core_web_lg" ]; then
    echo "Downloading NLP models on first run..."
    python -m spacy download en_core_web_lg
    python /usr/src/app/download_model.py
    echo "NLP models downloaded successfully"
fi

# publish app
python /usr/src/app/index.py
