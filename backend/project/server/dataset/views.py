import os
import random
import json

from flask import Blueprint, request, make_response, jsonify, send_file, send_from_directory
from flask.views import MethodView
from werkzeug.utils import secure_filename

from project.server import db
from project.server.models import Dataset, Configuration
from project.server import app

from project.server import utils
import pandas as pd
import subprocess

from tunga.retrieval import Twitter as tw

dataset_blueprint = Blueprint('dataset', __name__)


class DatasetManager:
    def __init__(self, dataset_path):
        self.dataset_path = dataset_path
        self.dataset_file_type = self.dataset_path.split(".")[-1]
        self.dataset = None
        self.delimiter = None
        self.analytics_result = {
            "n_rows": 0,
            "n_cols": 0,
            "n_missing_values": 0
        }
        self.columns = []
        self.df = None

    def create_dataframe(self):
        if self.dataset_file_type == "csv":
            return pd.read_csv(self.dataset_path)
        elif self.dataset_file_type == "xlsx" or self.dataset_file_type == "xls":
            return pd.read_excel(self.dataset_path)
        elif self.dataset_file_type == "json":
            return pd.read_json(self.dataset_file_type)
        elif self.dataset_file_type == "txt":
            with open(self.dataset_path, "r") as f:
                lines = pd.Series([item.strip() for item in f.readlines()])
            df_model = {
                "texts": lines
            }
            return pd.DataFrame(df_model)
        else:
            raise Exception("Unsupported data type")

    def analyze(self):
        df = self.create_dataframe()
        self.analytics_result["n_rows"] = df.shape[0]
        self.analytics_result["n_cols"] = df.shape[1]
        self.columns = df.columns
        self.df = df


class GetDatasetColumnNamesAPI(MethodView):
    def get(self, dataset_id):
        user = utils.get_user_from_header(request.headers)
        dataset = Dataset.query.filter_by(id=dataset_id).first()
        df = pd.read_csv(dataset.filepath)
        return jsonify({
            "dataset_id": dataset_id,
            "dataset_name": dataset.filename,
            "columns": list(df.columns)
        })


class GetUserDatasetsAPI(MethodView):
    """
    Bu method kullanıcın sahip olduğu bütün datasetleri getirir.
    """

    def get(self):
        user = utils.get_user_from_header(request.headers)
        user_datasets = []
        for ds in user.datasets:
            user_datasets.append(ds.as_dict())
        user_datasets = list(reversed(user_datasets))
        return make_response(jsonify({"datasets": user_datasets}))


class InspectDatasetAPI(MethodView):
    def get(self, dataset_id):
        user = utils.get_user_from_header(request.headers)
        dataset = Dataset.query.filter_by(id=dataset_id, user_id=user.id).first()
        if dataset:
            df = pd.read_csv(dataset.filepath).iloc[:100]  # TODO: Adjust row limit with configuration
            columns = list(df.columns)
            data = json.loads(df.T.to_json())
            my_data_list = [data[item] for item in data.keys()]
            return jsonify({
                "dataset_name": dataset.filename,
                "dataset_description": dataset.description,
                "columns": columns,
                "data": my_data_list
            })
        else:
            return jsonify({
                "status": "error",
                "reason": "dataset_not_found"
            }), 400


class DownloadDatasetAPI(MethodView):
    def get(self, dataset_id):
        user = utils.get_user_from_header(request.headers)
        dataset = Dataset.query.filter_by(id=dataset_id, user_id=user.id).first()
        return send_file(dataset.filepath, mimetype='application/x-csv', as_attachment=True,
                         attachment_filename=dataset.filename)


class TwitterHashtagAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()
        try:
            api_key = Configuration.query.filter_by(config_key="TWITTER_API_KEY", user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            api_secret = Configuration.query.filter_by(config_key="TWITTER_API_SECRET",
                                                       user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            access_token = Configuration.query.filter_by(config_key="TWITTER_ACCESS_TOKEN",
                                                         user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            token_secret = Configuration.query.filter_by(config_key="TWITTER_TOKEN_SECRET",
                                                         user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value

            result = tw.read_tweets_from_hashtag(api_key,
                                                 api_secret,
                                                 access_token,
                                                 token_secret,
                                                 post_data["hashtag"],
                                                 500)

            arr = []
            for item in result:
                arr.append(item["tweet_text"])

            df = pd.DataFrame({
                "tweet_text": pd.Series(arr)
            })
            filename = os.path.join(app.config['UPLOAD_PATH'], str(user.id)) + "/twitter_" + str(
                random.randint(100, 999)) + ".csv"

            df.to_csv(filename, index=None)
            dm = DatasetManager(filename)
            dm.analyze()
            dataset_name = post_data["dataset_name"]
            dataset_description = post_data["dataset_description"]
            try:
                dataset = Dataset(
                    filename=dataset_name,
                    description=dataset_description,
                    filepath=filename,
                    file_type="csv",
                    size=0,  # TODO: fix here
                    row_count=dm.analytics_result["n_rows"],
                    user_id=user.id,
                )
                db.session.add(dataset)
                db.session.commit()
                responseObject = {
                    'status': 'success',
                    'message': 'Successfully uploaded.',
                }

                return make_response(jsonify(responseObject)), 201

            except Exception as e:
                print(e)
                responseObject = {
                    'status': 'fail',
                    'message': str(e)
                }
                return make_response(jsonify(responseObject)), 400

        except Exception as e:
            return jsonify({"status": "fail", "reason": str(e)})


class TwitterUsernameAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()
        try:
            api_key = Configuration.query.filter_by(config_key="TWITTER_API_KEY", user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            api_secret = Configuration.query.filter_by(config_key="TWITTER_API_SECRET",
                                                       user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            access_token = Configuration.query.filter_by(config_key="TWITTER_ACCESS_TOKEN",
                                                         user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            token_secret = Configuration.query.filter_by(config_key="TWITTER_TOKEN_SECRET",
                                                         user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value

            result = tw.read_tweets_from_user(api_key,
                                              api_secret,
                                              access_token,
                                              token_secret,
                                              post_data["username"],
                                              500)

            arr = []
            for item in result:
                arr.append(item["tweet_text"])

            df = pd.DataFrame({
                "tweet_text": pd.Series(arr)
            })
            filename = os.path.join(app.config['UPLOAD_PATH'], str(user.id)) + "/twitter_" + str(
                random.randint(100, 999)) + ".csv"

            df.to_csv(filename, index=None)
            dm = DatasetManager(filename)
            dm.analyze()
            dataset_name = post_data["dataset_name"]
            dataset_description = post_data["dataset_description"]
            try:
                dataset = Dataset(
                    filename=dataset_name,
                    description=dataset_description,
                    filepath=filename,
                    file_type="csv",
                    size=0,  # TODO: fix here
                    row_count=dm.analytics_result["n_rows"],
                    user_id=user.id,
                )
                db.session.add(dataset)
                db.session.commit()
                responseObject = {
                    'status': 'success',
                    'message': 'Successfully uploaded.',
                }

                return make_response(jsonify(responseObject)), 201

            except Exception as e:
                print(e)
                responseObject = {
                    'status': 'fail',
                    'message': str(e)
                }
                return make_response(jsonify(responseObject)), 400

        except Exception as e:
            return jsonify({"status": "fail", "reason": str(e)})


class TwitterCheckAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        try:
            api_key = Configuration.query.filter_by(config_key="TWITTER_API_KEY", user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            api_secret = Configuration.query.filter_by(config_key="TWITTER_API_SECRET",
                                                       user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            access_token = Configuration.query.filter_by(config_key="TWITTER_ACCESS_TOKEN",
                                                         user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            token_secret = Configuration.query.filter_by(config_key="TWITTER_TOKEN_SECRET",
                                                         user_id=user.id).order_by(
                Configuration.id.desc()).first().config_value
            if len(api_key)>0 and len(api_secret)>0 and len(access_token)>0 and len(token_secret)>0:
                return jsonify({"status": "success"})
            else:
                return jsonify({"status": "fail"})
        except Exception as e:
            return jsonify({"status": "fail", "reason": str(e)})


class RemoteFileFetchAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()

        dataset_name = post_data["dataset_name"]
        dataset_description = post_data["dataset_description"]
        dataset_url = post_data["dataset_url"]
        file_name = dataset_url.split("/")[-1]
        upload_path = os.path.join(os.path.join(app.config['UPLOAD_PATH'], str(user.id)), file_name)
        a = subprocess.check_output(f"wget {dataset_url} -P {os.path.join(app.config['UPLOAD_PATH'], str(user.id))}",
                                    shell=True)

        dm = DatasetManager(upload_path)
        dm.analyze()

        try:
            dataset = Dataset(
                filename=dataset_name,
                description=dataset_description,
                filepath=os.path.join(app.config['UPLOAD_PATH'], str(user.id)) + file_name,
                file_type=dm.dataset_file_type,
                size=0,  # TODO: fix here
                row_count=dm.analytics_result["n_rows"],
                user_id=user.id,
            )
            db.session.add(dataset)
            db.session.commit()
            responseObject = {
                'status': 'success',
                'message': 'Successfully uploaded.',
                'analytics': dm.analytics_result
            }

            return make_response(jsonify(responseObject)), 201

        except Exception as e:
            print(e)
            responseObject = {
                'status': 'fail',
                'message': str(e)
            }
            return make_response(jsonify(responseObject)), 400


class LocalUploadAPI(MethodView):
    def post(self):
        user = utils.get_user_from_header(request.headers)
        file = request.files["file"]
        file_name = secure_filename(utils.generate_file_name(file.filename))
        file_owner_id = user.id
        dataset_name = request.form["dataset_name"]
        dataset_description = request.form["dataset_description"]

        file_type = file.filename.rsplit('.', 1)[1].lower()

        utils.create_user_upload_path_if_not_exists(app.config['UPLOAD_PATH'], str(user.id))
        upload_path = os.path.abspath(os.path.join(app.config['UPLOAD_PATH'], str(user.id), file_name))
        file.save(upload_path)

        dm = DatasetManager(upload_path)
        dm.analyze()

        try:
            dataset = Dataset(
                filename=dataset_name,
                description=dataset_description,
                filepath=upload_path,
                size=0,  # TODO: fix here
                row_count=dm.analytics_result["n_rows"],
                user_id=file_owner_id,
                file_type=file_type
            )
            db.session.add(dataset)
            db.session.commit()
            responseObject = {
                'status': 'success',
                'message': 'Successfully uploaded.',
                'analytics': {
                    'nrows': int(dm.analytics_result["n_rows"]),
                    'ncols': int(dm.analytics_result["n_cols"]),
                    'n_missing_values': int(dm.analytics_result["n_missing_values"])
                }
            }

            return make_response(jsonify(responseObject)), 201

        except Exception as e:
            responseObject = {
                'status': 'fail',
                'message': 'Some error occurred. Please try again.',
                'raw_error': str(e)
            }
            return make_response(jsonify(responseObject)), 400


local_dataset_upload_view = LocalUploadAPI.as_view('local_dataset_upload_api')
remote_dataset_upload_view = RemoteFileFetchAPI.as_view('remote_dataset_upload_api')
get_user_datasets = GetUserDatasetsAPI.as_view('get_user_datasets_api')
get_dataset_column_names = GetDatasetColumnNamesAPI.as_view('get_dataset_column_names_api')
get_dataset_inspection = InspectDatasetAPI.as_view('get_dataset_inspection_api')
twitter_check = TwitterCheckAPI.as_view('twitter_check_api')
twitter_username = TwitterUsernameAPI.as_view('twitter_username_api')
twitter_hashtag = TwitterHashtagAPI.as_view('twitter_hashtag_api')
download_dataset = DownloadDatasetAPI.as_view('download_dataset_api')

dataset_blueprint.add_url_rule(
    '/dataset/<dataset_id>/columns',
    view_func=get_dataset_column_names,
    methods=['GET']
)

dataset_blueprint.add_url_rule(
    '/dataset/<dataset_id>/inspect',
    view_func=get_dataset_inspection,
    methods=['GET']
)

dataset_blueprint.add_url_rule(
    '/dataset/<dataset_id>/download',
    view_func=download_dataset,
    methods=['GET']
)
dataset_blueprint.add_url_rule(
    '/dataset/local',
    view_func=local_dataset_upload_view,
    methods=['POST']
)

dataset_blueprint.add_url_rule(
    '/dataset/remote',
    view_func=remote_dataset_upload_view,
    methods=['POST']
)

dataset_blueprint.add_url_rule(
    '/dataset/all',
    view_func=get_user_datasets,
    methods=['GET']
)

dataset_blueprint.add_url_rule(
    '/dataset/twitter/check',
    view_func=twitter_check,
    methods=['POST']
)

dataset_blueprint.add_url_rule(
    '/dataset/twitter/hashtag',
    view_func=twitter_hashtag,
    methods=['POST']
)

dataset_blueprint.add_url_rule(
    '/dataset/twitter/username',
    view_func=twitter_username,
    methods=['POST']
)
