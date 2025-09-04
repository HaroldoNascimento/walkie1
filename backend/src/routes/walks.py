from flask import Blueprint, request, jsonify
from src.main import db
from src.models.walk import Walk
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

walks_bp = Blueprint("walks", __name__)

@walks_bp.route("/", methods=["POST"])
@jwt_required()
def add_walk():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    dog_id = data.get("dog_id")
    distance = data.get("distance")
    duration = data.get("duration")
    points = data.get("points")
    start_time = data.get("start_time")
    end_time = data.get("end_time")

    if not all([dog_id, distance, duration, points, start_time, end_time]):
        return jsonify({"message": "Missing data"}), 400

    try:
        start_time_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
        end_time_dt = datetime.fromisoformat(end_time.replace("Z", "+00:00"))
    except ValueError:
        return jsonify({"message": "Invalid date format"}), 400

    new_walk = Walk(
        dog_id=dog_id,
        user_id=int(current_user_id),
        distance=distance,
        duration=duration,
        points=points,
        start_time=start_time_dt,
        end_time=end_time_dt
    )
    db.session.add(new_walk)
    db.session.commit()

    return jsonify({"message": "Walk added successfully", "walk": {"id": new_walk.id}}), 201

@walks_bp.route("/", methods=["GET"])
@jwt_required()
def get_walks():
    current_user_id = get_jwt_identity()
    walks = Walk.query.filter_by(user_id=int(current_user_id)).all()
    output = []
    for walk in walks:
        output.append({
            "id": walk.id,
            "dog_id": walk.dog_id,
            "distance": walk.distance,
            "duration": walk.duration,
            "points": walk.points,
            "start_time": walk.start_time.isoformat(),
            "end_time": walk.end_time.isoformat()
        })
    return jsonify(output), 200


