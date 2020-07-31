from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
import pandas as pd
from project.server import bcrypt, db
from project.server.models import User, BlacklistToken, Dataset
from project.server import utils

from tunga.preprocessing.normalization import find_lang

lang_id_blueprint = Blueprint('language_identification', __name__)


class LanguageIdentificationAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()
        dataset = Dataset.query.filter_by(id=post_data["datasetId"], user_id=user.id).first()
        selected_column_name = post_data["column"]
        df = pd.read_csv(dataset.filepath)
        df["LANG_" + selected_column_name] = df[selected_column_name].fillna("").apply(find_lang)
        df.to_csv(dataset.filepath, index=None)
        return jsonify(post_data)


lang_id_controller = LanguageIdentificationAPI.as_view('keyword_extraction_api')

lang_id_blueprint.add_url_rule(
    '/ml/language_identification',
    view_func=lang_id_controller,
    methods=['POST']
)
