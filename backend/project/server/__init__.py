# project/server/__init__.py

import os

from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app_settings = os.getenv(
    'APP_SETTINGS',
    'project.server.config.DevelopmentConfig'
)
app.config.from_object(app_settings)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

from project.server.auth.views import auth_blueprint
from project.server.dataset.views import dataset_blueprint
from project.server.configuration.views import configuration_blueprint
from project.server.preprocessing.views import preprocessing_blueprint
from project.server.visualization.views import visualization_blueprint
from project.server.machine_learning.keyword_extraction.views import keyword_extraction_blueprint
from project.server.machine_learning.language_identification.views import lang_id_blueprint
from project.server.machine_learning.topic_modelling.views import topic_modelling_blueprint
from project.server.machine_learning.sentiment_analysis.views import sentiment_analysis_blueprint
from project.server.machine_learning.named_entity_recognition.views import named_entity_recognition_blueprint

app.register_blueprint(auth_blueprint)
app.register_blueprint(dataset_blueprint)
app.register_blueprint(configuration_blueprint)
app.register_blueprint(preprocessing_blueprint)
app.register_blueprint(keyword_extraction_blueprint)
app.register_blueprint(lang_id_blueprint)
app.register_blueprint(topic_modelling_blueprint)
app.register_blueprint(sentiment_analysis_blueprint)
app.register_blueprint(named_entity_recognition_blueprint)
app.register_blueprint(visualization_blueprint)

