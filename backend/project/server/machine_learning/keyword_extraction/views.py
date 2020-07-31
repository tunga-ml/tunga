from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
import pandas as pd
from project.server import bcrypt, db
from project.server.models import User, BlacklistToken, Dataset
from project.server import utils
from tunga.machine_learning.keyword_extraction import rake

keyword_extraction_blueprint = Blueprint('keyword_extraction', __name__)


class KeywordExtractionAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()
        dataset = Dataset.query.filter_by(id=post_data["datasetId"], user_id=user.id).first()
        selected_column_name = post_data["column"]
        df = pd.read_csv(dataset.filepath)
        #df["KEYWORDS_" + selected_column_name] = df[selected_column_name].fillna("").apply(rake.extract_keywords)
        df["KEYWORDS_" + selected_column_name] = pd.Series([rake.extract_keywords(str(item)) for item in df[selected_column_name]])
        df.to_csv(dataset.filepath, index=None)
        return jsonify(post_data)


keyword_extraction_controller = KeywordExtractionAPI.as_view('keyword_extraction_api')

keyword_extraction_blueprint.add_url_rule(
    '/ml/keyword_extraction',
    view_func=keyword_extraction_controller,
    methods=['POST']
)
