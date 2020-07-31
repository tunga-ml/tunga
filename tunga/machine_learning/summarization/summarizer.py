import pandas as pd
from nltk.tokenize import word_tokenize, sent_tokenize
import heapq
import nltk
import ssl

try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

nltk.download('punkt')
nltk.data.load("/Users/beyzacanbay/Desktop/tunga/tunga/machine_learning/summarization/punkt/turkish.pickle")

def summarize(words,sentences):

    word2count = {}
    for word in words:
        if word.lower() not in word2count.keys():
            word2count[word.lower()] = 1
        else:
            word2count[word.lower()] += 1

    maxi = max(word2count.values())

    for key in word2count.keys():
        word2count[key] = word2count[key] / maxi

    sent2score = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word in word2count.keys():
                if len(sentence.split(' ')) < 15:
                    if sentence not in sent2score.keys():
                        sent2score[sentence] = word2count[word]
                    else:
                        sent2score[sentence] += word2count[word]

    best_sentences = heapq.nlargest(5, sent2score, key=sent2score.get)
    return [' '.join(best_sentences)]
