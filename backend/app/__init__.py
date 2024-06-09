from flask import Flask
from flask_cors import CORS

from .routes import api_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Registrar el blueprint para las rutas de la API
    app.register_blueprint(api_bp)
    
    return app
