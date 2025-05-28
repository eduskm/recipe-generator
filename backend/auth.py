import os
from flask import Blueprint, request, jsonify
import requests
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from dotenv import load_dotenv

from models import db, User 
load_dotenv()
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth', methods=['POST'])
def authenticate():
    try:
        data = request.get_json()
        token = data.get("token")

        if not token:
            return jsonify({"error": "Missing token"}), 400

        try:
            idinfo = id_token.verify_oauth2_token(token, Request(), GOOGLE_CLIENT_ID)
            print(f"Token valid: {idinfo}")

            google_id = idinfo["sub"]
            email = idinfo["email"]
            name = idinfo.get("name")
            picture = idinfo.get("picture", "")

            user = User.query.filter_by(google_id=google_id).first()
            if not user:
                user = User(
                    google_id=google_id,
                    email=email,
                    name=name,
                    picture=picture
                )
                db.session.add(user)
                db.session.commit()

            user_info = {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "picture": user.picture,
            }

            return jsonify({"message": "Token valid", "user": user_info})

        except ValueError as e:
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401

    except Exception as e:
        return jsonify({"error": f"Error processing request: {str(e)}"}), 500


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    user = User(email=email, name=name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User created"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "picture": user.picture,
            }
        })
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    email = data.get('email') 
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if current_password == new_password:
        return jsonify({"error": "password is the same"}), 400

    if not email or not current_password or not new_password:
        return jsonify({"error": "Missing required fields"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.check_password(current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Password changed successfully"}), 200

@auth_bp.route("/check_session", methods=['POST'])
def check_session():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "id": user.id,
        "username": user.username
    })

@auth_bp.route('/delete_account', methods=['POST'])
def delete_account():
    """
    Deletes a user account.
    Requires email and current password for verification.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Missing email or password"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not user.check_password(password): # Verify password
            return jsonify({"error": "Invalid credentials, unable to delete account"}), 401

        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception as e:
        print(f"Error during account deletion: {str(e)}") # For debugging
        return jsonify({"error": f"Error processing account deletion: {str(e)}"}), 500