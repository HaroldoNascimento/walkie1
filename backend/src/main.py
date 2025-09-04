import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
app.config["JWT_SECRET_KEY"] = "super-secret"

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Import models to create tables
from src.models.user import User
from src.models.dog import Dog
from src.models.walk import Walk
from src.models.point_history import PointHistory
from src.models.badge import Badge
from src.models.earned_badge import EarnedBadge

# Import blueprints
from src.routes.auth import auth_bp
from src.routes.dogs import dogs_bp
from src.routes.walks import walks_bp
from src.routes.points import points_bp
from src.routes.badges import badges_bp
from src.routes.social import social_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(dogs_bp, url_prefix="/api/dogs")
app.register_blueprint(walks_bp, url_prefix="/api/walks")
app.register_blueprint(points_bp, url_prefix="/api/points")
app.register_blueprint(badges_bp, url_prefix="/api/badges")
app.register_blueprint(social_bp, url_prefix="/api/social")

@app.route("/api/health", methods=["GET"])
def health_check():
    return "OK", 200

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)


