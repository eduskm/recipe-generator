from flask import Blueprint, request, jsonify
from models import db, User, FavoriteRecipe

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorite-recipes', methods=['GET'])
def get_favorites():
    user_id = request.args.get('user_id') 
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    favorites = [fav.to_dict() for fav in user.favorite_recipes]
    return jsonify({"recipes": favorites})


@favorites_bp.route('/favorite-recipes', methods=['POST'])
def add_favorite():
    data = request.get_json() 
    user_id = data.get('user_id')
    recipe_data = data.get('recipe')

    if not user_id or not recipe_data:
        return jsonify({"error": "Missing user_id or recipe data"}), 400

    recipe_id = recipe_data.get('id')
    if not recipe_id:
        return jsonify({"error": "Recipe data must include an id"}), 400

    if FavoriteRecipe.query.filter_by(user_id=user_id, recipe_id=recipe_id).first():
        return jsonify({"message": "Recipe already in favorites"}), 200

    new_favorite = FavoriteRecipe(
        user_id=user_id,
        recipe_id=recipe_id,
        title=recipe_data.get('title'),
        image=recipe_data.get('image'),
        source_url=recipe_data.get('sourceUrl'),
        ready_in_minutes=recipe_data.get('readyInMinutes'),
        servings=recipe_data.get('servings'),
        summary=recipe_data.get('summary'),
        extended_ingredients=recipe_data.get('extendedIngredients', []),
        analyzed_instructions=recipe_data.get('analyzedInstructions', [])
    )
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify(new_favorite.to_dict()), 201



@favorites_bp.route('/favorite-recipes/<int:recipe_id>', methods=['DELETE'])
def remove_favorite(recipe_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required for deletion"}), 400

    favorite = FavoriteRecipe.query.filter_by(user_id=user_id, recipe_id=recipe_id).first()

    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Favorite removed"}), 200
    
    return jsonify({"error": "Favorite not found"}), 404



@favorites_bp.route('/favorite-recipes/clear', methods=['POST'])
def clear_all_favorites():
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
        
    FavoriteRecipe.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({"message": "All favorites cleared"}), 200