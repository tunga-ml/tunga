# project/server/models.py


import jwt
import datetime

from project.server import app, db, bcrypt


class User(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)
    datasets = db.relationship("Dataset")
    configurations = db.relationship("Configuration")

    def __init__(self, username, email, password, admin=False):
        self.email = email
        self.username = username
        self.password = bcrypt.generate_password_hash(
            password, app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()
        self.registered_on = datetime.datetime.now()
        self.admin = admin

    def encode_auth_token(self, user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=60, seconds=5),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id,
                'username': self.username
            }
            return jwt.encode(
                payload,
                app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Validates the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            is_blacklisted_token = BlacklistToken.check_blacklist(auth_token)
            if is_blacklisted_token:
                return 'Token blacklisted. Please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'


class BlacklistToken(db.Model):
    """
    Token Model for storing JWT tokens
    """
    __tablename__ = 'blacklist_tokens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        # check whether auth token has been blacklisted
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False


class Configuration(db.Model):
    __tablename__ = "configurations"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    config_key = db.Column(db.String(255), unique=False)
    config_value = db.Column(db.String(255), unique=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __init__(self, config_key, config_value, user_id, is_active=True):
        self.config_key = config_key
        self.config_value = config_value
        self.user_id = user_id
        self.created_at = datetime.datetime.now()
        self.is_active = is_active

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Dataset(db.Model):
    __tablename__ = "datasets"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(255), unique=False)
    filetype = db.Column(db.String(255), unique=False, nullable=True, default="raw")
    description = db.Column(db.String(255), unique=False, nullable=False)
    filepath = db.Column(db.String(255), nullable=False)
    size = db.Column(db.Integer, nullable=False)
    row_count = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    last_updated = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __init__(self, filename, description, filepath, size, row_count, user_id, file_type, is_active=False):
        self.filename = filename
        self.description = description
        self.filepath = filepath

        self.size = size
        self.row_count = row_count

        self.created_at = datetime.datetime.now()
        self.last_updated = datetime.datetime.now()

        self.is_active = is_active
        self.user_id = user_id
        self.filetype = file_type

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
