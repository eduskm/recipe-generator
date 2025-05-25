// services/apiService.js
const API_BASE_URL = "http://localhost:5000";

export const apiService = {
  async generateRecipes(ingredients) {
    const response = await fetch(`${API_BASE_URL}/generate-recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredients.join(",") }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  async getRecipeLinks(recipeIds) {
    const response = await fetch(`${API_BASE_URL}/get-recipe-links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "recipe-ids": recipeIds })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
};