import React, { useState } from 'react';
import veggiesImage from '/veggies.jpg';
// Sample Recipes
const recipes = [
    {
        name: "Chicken Soup",
        ingredients: ["Chicken", "Garlic", "Carrot"],
        instructions: "Boil chicken with garlic and carrots for 30 minutes."
    },
    {
        name: "Tomato Salad",
        ingredients: ["Tomato", "Onion", "Garlic"],
        instructions: "Chop tomatoes, onions, and garlic. Mix together."
    },
    {
        name: "Vegetable Stir Fry",
        ingredients: ["Carrot", "Garlic", "Onion"],
        instructions: "Stir fry chopped vegetables in a pan for 10 minutes."
    },
];

function RecipeFinder() {
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    // Handle ingredient selection
    const handleIngredientChange = (ingredient) => {
        setSelectedIngredients((prevState) =>
            prevState.includes(ingredient)
                ? prevState.filter(item => item !== ingredient)
                : [...prevState, ingredient]
        );
    };

    // Filter recipes based on selected ingredients
    const filterRecipes = () => {
        return recipes.filter(recipe =>
            recipe.ingredients.every(ingredient => selectedIngredients.includes(ingredient))
        );
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#FFF1F5] font-sans">
            {/* Floating Container */}
            <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-xl">
                <div className="flex">
                    {/* Left Menu (Ingredients) */}
                    <div
                        className="w-64 p-6 text-white rounded-lg mr-8 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${veggiesImage})` }}
                    >


                        {/* Overlay and Blur */}
                        <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                        <div className="absolute inset-0 bg-opacity-20 backdrop-blur-sm rounded-lg"></div>

                        <h2 className="text-2xl font-semibold text-center mb-4 relative z-10">Ingredients</h2>
                        <ul id="ingredients-list" className="space-y-4 relative z-10">
                            {["Onion", "Tomato", "Garlic", "Chicken", "Carrot"].map((ingredient) => (
                                <li key={ingredient}>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIngredients.includes(ingredient)}
                                            onChange={() => handleIngredientChange(ingredient)}
                                            className="mr-2"
                                        />
                                        {ingredient}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Area (Recipes) */}
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Recipes</h2>
                        <div id="recipe-list" className="space-y-6">
                            {/* Display Recipes */}
                            {filterRecipes().length === 0 ? (
                                <p className="text-center text-gray-500">No recipes match the selected ingredients.</p>
                            ) : (
                                filterRecipes().map((recipe, index) => (
                                    <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.name}</h3>
                                        <p className="text-gray-600"><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                                        <p className="text-gray-600 mt-2"><strong>Instructions:</strong> {recipe.instructions}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default RecipeFinder;
