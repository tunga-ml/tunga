from collections import Counter

from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
import pandas as pd
from project.server import bcrypt, db
from project.server.models import User, BlacklistToken, Dataset
from project.server import utils

visualization_blueprint = Blueprint('visualization', __name__)


class VisualizationAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()
        print(post_data)

        dataset = Dataset.query.filter_by(id=post_data["datasetId"], user_id=user.id).first()
        df = pd.read_csv(dataset.filepath)

        result_json = {
            "sentiment": {
                "data": [],
                "labels": []
            },
            "most_common_words": {
                "data": [],
                "labels": []
            },
            "most_common_topics": {
                "data": [],
                "labels": []
            },
            "word_cloud": []

        }
        try:
            sentiment_column = self.__get_sentiment_column_name(df.columns)
            sentiment_series = df[sentiment_column]
            sentiment_counter = Counter()
            sentiment_counter.update(sentiment_series)
            result_json["sentiment"] = {
                "labels": ["positive", "negative"],
                "data": [sentiment_counter["positive"], sentiment_counter["negative"]]
            }
            del sentiment_series
            del sentiment_counter
        except:
            pass
        try:
            processed_column = self.__get_processed_column_name(df.columns)
            processed_series = df[processed_column]
            word_counter = Counter()
            for item in processed_series:
                word_counter.update(str(item).split())
            result_json["most_common_words"] = {}
            result_json["most_common_words"]["labels"] = [item[0] for item in word_counter.most_common(10)]
            result_json["most_common_words"]["data"] = [item[1] for item in word_counter.most_common(10)]

            for item in word_counter.most_common(100):
                result_json["word_cloud"].append({
                    "text": item[0],
                    "value": item[1]
                })
        except Exception as e:
            print("burda bir hata oldu")
            print(e)

        try:
            topic_column = self.__get_topic_column_name(df.columns)
            topic_series = df[topic_column]
            topic_counter = Counter()
            topic_counter.update(list(topic_series))
            result_json["most_common_topics"] = {}
            result_json["most_common_topics"]["labels"] = ["Topic #" + str(item[0]) for item in
                                                           topic_counter.most_common(50)]
            result_json["most_common_topics"]["data"] = [item[1] for item in topic_counter.most_common(50)]

        except Exception as e:
            print("burda bir hata oldu")
            print(e)

        try:
            topic_column = self.__get_topic_column_name(df.columns)
            topic_series = df[topic_column]
            topic_counter = Counter()
            topic_counter.update(list(topic_series))
            result_json["most_common_topics"] = {}
            result_json["most_common_topics"]["labels"] = ["Topic #" + str(item[0]) for item in
                                                           topic_counter.most_common(50)]
            result_json["most_common_topics"]["data"] = [item[1] for item in topic_counter.most_common(50)]

        except Exception as e:
            print("burda bir hata oldu")
            print(e)

        return jsonify(result_json)

    @staticmethod
    def __get_sentiment_column_name(columns):
        for item in list(columns):
            if item.startswith("SENTIMENT_"):
                return item

    @staticmethod
    def __get_processed_column_name(columns):
        for item in list(columns):
            if item.startswith("PREPROCESSED_"):
                return item

    @staticmethod
    def __get_topic_column_name(columns):
        for item in list(columns):
            if item.startswith("TOPIC_"):
                return item


visualization_controller = VisualizationAPI.as_view('visualization_api')

visualization_blueprint.add_url_rule(
    '/visualization',
    view_func=visualization_controller,
    methods=['POST']
)
