from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView

from project.server import bcrypt, db
from project.server.models import User, BlacklistToken, Configuration
from project.server import utils

configuration_blueprint = Blueprint('configuration', __name__)


class ConfigurationControllerAPI(MethodView):
    def get(self):
        """
        Fetch all configs according to the user_id
        :return: user's configutarions.
        """
        user = utils.get_user_from_header(request.headers)
        user_configs = []
        for ds in user.configurations:
            user_configs.append(ds.as_dict())
        user_configs = list(reversed(user_configs))
        return make_response(jsonify({"configs": user_configs}))

    def post(self):
        """
        Add new config to the user configurations
        :return: status
        """
        user = utils.get_user_from_header(request.headers)
        post_data = request.get_json()
        try:
            config = Configuration(
                config_key=post_data["config_key"],
                config_value=post_data["config_value"],
                user_id=user.id,
            )
            db.session.add(config)
            db.session.commit()
            responseObject = {
                'status': 'success',
                'message': 'Add new configuration successful.'
            }

            return make_response(jsonify(responseObject)), 201

        except Exception as e:
            responseObject = {
                'status': 'fail',
                'message': 'Some error occurred. Please try again.',
                'raw_error': e
            }
            return make_response(jsonify(responseObject)), 400


configuration_controller = ConfigurationControllerAPI.as_view('configuration_controller_api')

configuration_blueprint.add_url_rule(
    '/configuration',
    view_func=configuration_controller,
    methods=['GET', 'POST']
)
