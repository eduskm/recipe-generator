import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_migrate import Migrate
import requests
from auth import auth_bp  # Blueprintul de autentificare
from models import db     # Obiectul SQLAlchemy

load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)



app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

migrate = Migrate(app, db)
app.register_blueprint(auth_bp)

API_KEY = os.getenv("SPOONACULAR_API_KEY")

@app.route("/generate-recipes", methods=["POST"])
def generate_recipes():
    data = request.json
    ingredients = data.get("ingredients", "")
    num_of_recipes = data.get("num_of_recipes", 5)

    if not ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    url = "https://api.spoonacular.com/recipes/findByIngredients"
    params = {
        "ingredients": ingredients,
        "number": num_of_recipes,
        "apiKey": API_KEY
    }

    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch recipes"}), 500

    recipes = response.json()
    ids = ",".join(str(recipe["id"]) for recipe in recipes)

    return jsonify({"recipe-ids": ids})

@app.route("/get-recipe-links", methods=["POST"])
def get_recipe_link():
    data = request.json
    ids = data.get("recipe-ids", "")
    if not ids:
        return jsonify({"error": "No ids provided"}), 400

    url = "https://api.spoonacular.com/recipes/informationBulk"
    params = {
        "ids": ids,
        "apiKey": API_KEY
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch links of recipes"}), 500

    return jsonify(response.json())

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
