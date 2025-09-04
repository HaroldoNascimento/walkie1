from flask import Blueprint, request, jsonify
from src.main import db
from src.models.point_history import PointHistory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

points_bp = Blueprint("points", __name__)

@points_bp.route("/", methods=["POST"])
@jwt_required()
def add_points():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    points_earned = data.get("points_earned")

    if not points_earned:
        return jsonify({"message": "Points earned is required"}), 400

    new_point_history = PointHistory(
        user_id=int(current_user_id),
        points_earned=points_earned,
        timestamp=datetime.now()
    )
    db.session.add(new_point_history)
    db.session.commit()

    return jsonify({"message": "Points added successfully"}), 201

@points_bp.route("/", methods=["GET"])
@jwt_required()
def get_points_history():
    current_user_id = get_jwt_identity()
    history = PointHistory.query.filter_by(user_id=int(current_user_id)).all()
    output = []
    for entry in history:
        output.append({
            "id": entry.id,
            "points_earned": entry.points_earned,
            "timestamp": entry.timestamp.isoformat()
        })
    return jsonify(output), 200


