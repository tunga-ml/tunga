from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
import pandas as pd
from project.server import bcrypt, db
from project.server.models import User, BlacklistToken, Dataset
from project.server import utils

from tunga.machine_learning.sentiment_analysis import bert_sentiment

sentiment_analysis_blueprint = Blueprint('sentiment_analysis', __name__)


class SentimentAnalysisAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()
        dataset = Dataset.query.filter_by(id=post_data["datasetId"], user_id=user.id).first()
        selected_column_name = post_data["column"]
        df = pd.read_csv(dataset.filepath)
        df["SENTIMENT_" + selected_column_name] = pd.Series(
            [bert_sentiment.get_sentiment(str(item))[0] for item in df[selected_column_name]])
        df.to_csv(dataset.filepath, index=None)
        return jsonify(post_data)


sentiment_analysis_controller = SentimentAnalysisAPI.as_view('sentiment_analysis_api')

sentiment_analysis_blueprint.add_url_rule(
    '/ml/sentiment_analysis',
    view_func=sentiment_analysis_controller,
    methods=['POST']
)
