import warnings
import numpy as np

warnings.simplefilter("ignore", DeprecationWarning)

from sklearn.decomposition import LatentDirichletAllocation as LDA
from sklearn.feature_extraction.text import CountVectorizer


def __get_topic_info(model, count_vectorizer, n_top_words):
    """
    A utility method that generates the detailed topic information
    :param model: LDA model trained int topic_modeller method
    :param count_vectorizer: vectorizer object to get statistical results
    :param n_top_words: num of words for each topic
    :return: topic info
    """
    words = count_vectorizer.get_feature_names()
    topic_info = {}
    for topic_idx, topic in enumerate(model.components_):
        topic_info[topic_idx] = [words[i] for i in topic.argsort()[:-n_top_words - 1:-1]]

    return topic_info


def topic_modeller(column, num_topics=10, num_words=10):
    """
    Generate topics from given train dataset.
    :param column: list of texts (train data)
    :param num_topics: number of topics to be seperated
    :param num_words: number of keywords for each topic
    :return: tuple that contains topic id numbers for each item in column and detailed info for each topic
    """
    count_vectorizer = CountVectorizer()
    count_data = count_vectorizer.fit_transform([str(item) for item in column])
    lda = LDA(n_components=num_topics, n_jobs=-1)
    m = lda.fit_transform(count_data)
    topic_info = __get_topic_info(lda, count_vectorizer, num_words)
    new_column = []
    for item in m:
        new_column.append(np.argmax(item))
    return new_column, topic_info
