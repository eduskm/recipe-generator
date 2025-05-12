import React, { useState } from 'react';
import veggiesImage from '/veggies.jpg';
import SearchBar from './SearchBar';

function RecipeFinder() {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);


    // Handle ingredient selection
    const handleIngredientChange = (ingredient) => {
        setSelectedIngredients((prevState) =>
            prevState.includes(ingredient)
                ? prevState.filter(item => item !== ingredient)
                : [...prevState, ingredient]
        );
    };


    const fetchRecipes = async () => {
        const res = await fetch("http://localhost:5000/generate-recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients: selectedIngredients.join(",") }),
        });

        const data = await res.json();
        return data
    };

    const recipeLinks = async () => {
        const ids = await fetchRecipes();

        const res = await fetch("http://localhost:5000/get-recipe-links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "recipe-ids": ids["recipe-ids"] })
        })

        const data = await res.json();
        setRecipes(data);
    }

    console.log(recipes);
    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EADBDD] font-sans">
            {/* Floating Container */}
            <div className="w-full max-w-6xl bg-white p-8 rounded-3xl shadow-xl">
                <div className="flex">
                    {/* Left Menu (Ingredients) */}
                    <div
                        className="w-64 p-3 text-white rounded-lg mr-8 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${veggiesImage})` }}
                    >
                        <div class="w-full max-w-md mx-auto relative z-21 p-3">
                            <SearchBar onSelect={handleIngredientChange} />
                        </div>


                        {/* Overlay and Blur */}
                        <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                        <div className="absolute inset-0 bg-opacity-20 backdrop-blur-sm rounded-lg"></div>
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
                        <button
                            onClick={recipeLinks}
                            className="mt-4 w-full bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700 transition duration-300 relative z-20"
                        >
                            Generează Rețete
                        </button>
                    </div>

                    {/* Main Area (Recipes) */}
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Recipes</h2>
                        <div id="recipe-list" className="space-y-6">
                            {/* Display Recipes */}
                            {recipes.length === 0 ? (
                                <p className="text-center text-gray-500">No recipes match the selected ingredients.</p>
                            ) : (
                                recipes.map((recipe, index) => (
                                    <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.sourceName}</h3>
                                        <p className="text-gray-600"><strong>Ingredients:</strong> {recipe.readyInMinutes}</p>
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
