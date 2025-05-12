import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
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
    ids = ""
    for recipe in recipes:
        ids += str(recipe["id"]) + ","
    
    if ids.endswith(","):
        ids = ids[:-1]

    return jsonify({"recipe-ids": ids})
@app.route("/get-recipe-links", methods=["POST"])
def get_recipe_link():
    data = request.json
    ids = data.get("recipe-ids", "")
    print(ids)
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
    
    response = response.json()
    
    
    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
