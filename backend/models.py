from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.types import JSON # Import the JSON type

db = SQLAlchemy()

# ... (User model remains the same) ...
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(128), unique=True, nullable=True)
    email = db.Column(db.String(128), unique=True, nullable=False)
    name = db.Column(db.String(128))
    picture = db.Column(db.String(256))
    password_hash = db.Column(db.String(256))
    favorite_recipes = db.relationship('FavoriteRecipe', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class FavoriteRecipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    recipe_id = db.Column(db.Integer, nullable=False, unique=True) # Ensure recipe_id is unique per user
    title = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(255))
    source_url = db.Column(db.String(255))
    ready_in_minutes = db.Column(db.Integer)
    servings = db.Column(db.Integer)
    summary = db.Column(db.Text)
    extended_ingredients = db.Column(JSON) # Store as JSON
    analyzed_instructions = db.Column(JSON) # Store as JSON

    def to_dict(self):
        return {
            'id': self.recipe_id,
            'recipe_id': self.recipe_id,
            'title': self.title,
            'image': self.image,
            'sourceUrl': self.source_url,
            'readyInMinutes': self.ready_in_minutes,
            'servings': self.servings,
            'summary': self.summary,
            'extendedIngredients': self.extended_ingredients,
            'analyzedInstructions': self.analyzed_instructions,
        }