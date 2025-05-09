from flask import Flask
from dotenv import load_dotenv
import os
import requests

app = Flask(__name__)

load_dotenv()
spoon_apikey = os.getenv("SPOONACULAR_API_KEY")

@app.route("/generate-recipe")
def home():
    response = requests.get(f"https://api.spoonacular.com/recipes/findByIngredients?ingredients=chicken,tomatoes,onions&number=5&apiKey={spoon_apikey}")
    data = response.json()
    return data

if __name__ == "__main__":
    app.run(debug=True)
