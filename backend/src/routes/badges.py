from flask import Blueprint, request, jsonify
from src.main import db
from src.models.badge import Badge
from src.models.earned_badge import EarnedBadge
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

badges_bp = Blueprint("badges", __name__)

@badges_bp.route("/", methods=["POST"])
@jwt_required()
def add_badge():
    data = request.get_json()
    name = data.get("name")
    description = data.get("description")

    if not all([name, description]):
        return jsonify({"message": "Name and description are required"}), 400

    if Badge.query.filter_by(name=name).first():
        return jsonify({"message": "Badge with this name already exists"}), 409

    new_badge = Badge(name=name, description=description)
    db.session.add(new_badge)
    db.session.commit()

    return jsonify({"message": "Badge added successfully", "badge": {"id": new_badge.id, "name": new_badge.name}}), 201

@badges_bp.route("/", methods=["GET"])
@jwt_required()
def get_badges():
    badges = Badge.query.all()
    output = []
    for badge in badges:
        output.append({"id": badge.id, "name": badge.name, "description": badge.description})
    return jsonify(output), 200

@badges_bp.route("/earn", methods=["POST"])
@jwt_required()
def earn_badge():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    badge_id = data.get("badge_id")

    if not badge_id:
        return jsonify({"message": "Badge ID is required"}), 400

    badge = Badge.query.get(badge_id)
    if not badge:
        return jsonify({"message": "Badge not found"}), 404

    if EarnedBadge.query.filter_by(user_id=int(current_user_id), badge_id=badge_id).first():
        return jsonify({"message": "Badge already earned by this user"}), 409

    new_earned_badge = EarnedBadge(
        user_id=int(current_user_id),
        badge_id=badge_id,
        timestamp=datetime.now()
    )
    db.session.add(new_earned_badge)
    db.session.commit()

    return jsonify({"message": "Badge earned successfully"}), 201

@badges_bp.route("/earned", methods=["GET"])
@jwt_required()
def get_earned_badges():
    current_user_id = get_jwt_identity()
    earned_badges = EarnedBadge.query.filter_by(user_id=int(current_user_id)).all()
    output = []
    for earned_badge in earned_badges:
        badge = Badge.query.get(earned_badge.badge_id)
        output.append({
            "id": earned_badge.id,
            "badge_name": badge.name if badge else "Unknown",
            "description": badge.description if badge else "",
            "timestamp": earned_badge.timestamp.isoformat()
        })
    return jsonify(output), 200


