from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
import pandas as pd
from project.server import bcrypt, db
from project.server.models import User, BlacklistToken, Dataset
from project.server import utils

from tunga.machine_learning.topic_modelling import topic_modeller

topic_modelling_blueprint = Blueprint('topic_modelling', __name__)


class TopicModellingAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()
        print(post_data)
        dataset = Dataset.query.filter_by(id=post_data["datasetId"], user_id=user.id).first()
        selected_column_name = post_data["column"]

        try:
            num_topics = post_data["numTopics"]
        except:
            num_topics = 10

        try:
            num_keywords = post_data["numKeywords"]
        except:
            num_keywords = 10

        df = pd.read_csv(dataset.filepath)
        df["TOPIC_" + selected_column_name], topic_information = pd.Series(
            topic_modeller.topic_modeller(df[selected_column_name], num_topics, num_keywords)).fillna("")
        # df["KEYWORDS_" + selected_column_name] = df[selected_column_name].apply(topic_modeller.topic_modeller,
        #                                                                        args=(num_topics))
        df.to_csv(dataset.filepath, index=None)

        result = []
        for item in topic_information:
            result.append({
                "id":item,
                "keywords":topic_information[item]
            })
        return jsonify(result)


topic_modelling_controller = TopicModellingAPI.as_view('topic_modelling_api')

topic_modelling_blueprint.add_url_rule(
    '/ml/topic_modelling',
    view_func=topic_modelling_controller,
    methods=['POST']
)
