import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


def test_generate_recipes_no_ingredients():
    client = app.test_client()
    response = client.post("/generate-recipes", json={})
    assert response.status_code == 400
    assert b"No ingredients provided" in response.data

def test_generate_recipes_valid_input():
    client = app.test_client()
    response = client.post("/generate-recipes", json={"ingredients": ["egg", "milk"]})
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert "recipe-ids" in data


def test_login_invalid_credentials():
    client = app.test_client()
    response = client.post("/login", json={"email": "fail@test.com", "password": "123"})
    assert response.status_code == 401
    json_data = response.get_json()
    assert json_data["error"] == "Invalid credentials"

