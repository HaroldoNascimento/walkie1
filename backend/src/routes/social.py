from flask import Blueprint, jsonify
from src.main import db
from src.models.user import User
from src.models.walk import Walk
from src.models.dog import Dog
from flask_jwt_extended import jwt_required, get_jwt_identity

social_bp = Blueprint("social", __name__)

@social_bp.route("/leaderboard", methods=["GET"])
@jwt_required()
def get_leaderboard():
    # This is a simplified example. A real leaderboard would involve more complex queries.
    users = User.query.all()
    leaderboard_data = []
    for user in users:
        total_distance = db.session.query(db.func.sum(Walk.distance)).filter_by(user_id=user.id).scalar() or 0
        total_points = db.session.query(db.func.sum(Walk.points)).filter_by(user_id=user.id).scalar() or 0
        leaderboard_data.append({
            "username": user.username,
            "total_distance": total_distance,
            "total_points": total_points
        })
    
    leaderboard_data.sort(key=lambda x: x["total_points"], reverse=True)
    return jsonify(leaderboard_data), 200

@social_bp.route("/user_stats", methods=["GET"])
@jwt_required()
def get_user_stats():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"message": "User not found"}), 404

    total_walks = Walk.query.filter_by(user_id=user.id).count()
    total_distance = db.session.query(db.func.sum(Walk.distance)).filter_by(user_id=user.id).scalar() or 0
    total_duration = db.session.query(db.func.sum(Walk.duration)).filter_by(user_id=user.id).scalar() or 0
    total_points = db.session.query(db.func.sum(Walk.points)).filter_by(user_id=user.id).scalar() or 0
    total_dogs = Dog.query.filter_by(user_id=user.id).count()

    return jsonify({
        "username": user.username,
        "total_walks": total_walks,
        "total_distance": total_distance,
        "total_duration": total_duration,
        "total_points": total_points,
        "total_dogs": total_dogs
    }), 200


