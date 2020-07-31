from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
import pandas as pd

from project.server import db
from project.server.models import Configuration, Dataset
from project.server import utils

from tunga import preprocessing

preprocessing_blueprint = Blueprint('preprocessing', __name__)


class PreprocessingControllerAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()

        selected_steps = post_data["selectedSteps"]
        dataset = Dataset.query.filter_by(id=post_data["datasetId"], user_id=user.id).first()
        selected_column_name = post_data["column"]

        df = pd.read_csv(dataset.filepath)

        df["PREPROCESSED_" + selected_column_name] = self.apply_preprocessing_steps_to_column(selected_steps,
                                                                                              df[selected_column_name])

        df.to_csv(dataset.filepath, index=None)
        return jsonify(post_data)

    @staticmethod
    def apply_preprocessing_steps_to_column(steps, column):
        function_map = {'lowercase': preprocessing.lowercase,
                        'uppercase': preprocessing.uppercase,
                        'remove_punctuations': preprocessing.remove_punctuations,
                        'remove_stopwords': preprocessing.remove_stopwords,
                        'remove_digits': preprocessing.remove_digits,
                        'remove_emails': preprocessing.remove_email,
                        'remove_urls': preprocessing.remove_url,
                        'remove_emojis': preprocessing.remove_emojis,
                        'remove_hashtags': preprocessing.remove_hashtag,
                        'remove_mentions': preprocessing.remove_mentions,
                        'remove_non_turkish_words': False,
                        'correct_typos': preprocessing.correct_typo,
                        'lemmatize': preprocessing.lemmatization,
                        'stem': preprocessing.stem,
                        'asciify': False,
                        'deasciify': preprocessing.deasciify}
        print(steps)
        for key in steps.keys():
            if steps[key]:
                try:
                    # column = column.fillna("").apply(function_map[key])
                    column = pd.Series([function_map[key](str(item)) for item in column])
                except Exception as e:
                    print(e)
                    print("Not implemented preprocessing step", key)
        return column


preprocessing_controller = PreprocessingControllerAPI.as_view('preprocessing_controller_api')

preprocessing_blueprint.add_url_rule(
    '/preprocessing',
    view_func=preprocessing_controller,
    methods=['POST']
)
