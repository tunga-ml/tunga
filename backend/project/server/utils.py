import os
import random

from project.server.models import User


def get_user_from_header(header_data):
    """
    Checks the HTTP header and creates user object according to the header.
    :param header_data:
    :return: User
    """
    auth_header = header_data.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            user = User.query.filter_by(id=resp).first()
            return user

    raise Exception("User not found")


def generate_file_name(original_file_name):
    """
    Generate a fancy filename for uploaded files
    :param original_file_name:
    :return: generated_file_name
    """
    return original_file_name.split(".")[0] + "_" + str(random.randint(10000, 99999)) + "." + \
           original_file_name.split(".")[1]


def create_user_upload_path_if_not_exists(upload_path, user_id):
    """
    Generates the upload path according to the user_id
    :param upload_path:
    :param user_id:
    :return: nothing just creates the directory
    """
    if not os.path.isdir(os.path.join(upload_path, str(user_id))):
        os.makedirs(os.path.join(upload_path, str(user_id)))


def is_extention_allowed(filename):
    """
    Checks file extension is allowed
    :param filename:
    :return: is_allowed
    """
    ALLOWED_EXTENSIONS = ["txt", "csv", "xlsx"]
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
