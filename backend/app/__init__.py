from flask import Flask, send_from_directory
from flask_cors import CORS
from .routes import api_bp


def create_app():
    app = Flask(__name__)

    # Configuración de CORS para permitir acceso a la API desde cualquier origen
    CORS(app, origins=["*"])

    # Registrar el blueprint para las rutas de la API
    app.register_blueprint(api_bp)

    return app
