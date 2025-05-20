import os
from flask import Blueprint, request, jsonify
import requests
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from dotenv import load_dotenv

from models import db, User  # 👈 importă modelul User și obiectul db

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

        # Verifică token-ul cu Google
        try:
            idinfo = id_token.verify_oauth2_token(token, Request(), GOOGLE_CLIENT_ID)
            print(f"Token valid: {idinfo}")

            # Extrage informații despre utilizator
            google_id = idinfo["sub"]
            email = idinfo["email"]
            name = idinfo.get("name")
            picture = idinfo.get("picture", "")

            # Verifică dacă utilizatorul există în baza de date
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