from flask import Blueprint, request, jsonify
from src.main import db
from src.models.dog import Dog
from flask_jwt_extended import jwt_required, get_jwt_identity

dogs_bp = Blueprint("dogs", __name__)

@dogs_bp.route("/", methods=["POST"])
@jwt_required()
def add_dog():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get("name")
    breed = data.get("breed")

    if not name:
        return jsonify({"message": "Dog name is required"}), 400

    new_dog = Dog(name=name, breed=breed, user_id=int(current_user_id))
    db.session.add(new_dog)
    db.session.commit()

    return jsonify({"message": "Dog added successfully", "dog": {"id": new_dog.id, "name": new_dog.name, "breed": new_dog.breed}}), 201

@dogs_bp.route("/", methods=["GET"])
@jwt_required()
def get_dogs():
    current_user_id = get_jwt_identity()
    dogs = Dog.query.filter_by(user_id=int(current_user_id)).all()
    output = []
    for dog in dogs:
        output.append({"id": dog.id, "name": dog.name, "breed": dog.breed})
    return jsonify(output), 200


