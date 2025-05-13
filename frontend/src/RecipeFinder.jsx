import React, { useState, useRef } from 'react';
import veggiesImage from '/veggies.jpg';
import SearchBar from './SearchBar';
import CategoryBox from './CategoryBox';
import { motion, AnimatePresence } from "framer-motion";
import Popup from './Popup';
import { FaRegTrashCan } from "react-icons/fa6";
import RemoveButton from './RemoveButton';

function RecipeFinder() {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [lastSelectedIngredient, setLastSelectedIngredient] = useState(null);
    const popupTimeoutRef = useRef(null);

    const ingredientsByCategory = {
        Vegetables: [
            "Carrot", "Onion", "Garlic", "Bell Pepper", "Broccoli", "Spinach", "Kale", "Zucchini", "Potato", "Sweet Potato",
            "Cucumber", "Tomato", "Green Beans", "Mushrooms", "Celery", "Cauliflower", "Asparagus", "Eggplant", "Leek", "Radish",
            "Cabbage", "Brussels Sprouts", "Arugula", "Butternut Squash", "Chard", "Fennel", "Beetroot", "Squash", "Pumpkin",
            "Lettuce", "Sweet Corn", "Parsnip", "Turnip", "Okra", "Chili Pepper", "Bamboo Shoots", "Jalapeno", "Mung Bean Sprouts",
            "Watercress", "Yam", "Artichoke", "Taro", "Chayote", "Rutabaga", "Kohlrabi", "Tatsoi", "Edamame"
        ],
        Fruits: [
            "Apple", "Banana", "Orange", "Strawberry", "Blueberry", "Lemon", "Lime", "Grapes", "Pineapple", "Avocado",
            "Watermelon", "Peach", "Mango", "Raspberry", "Cherry", "Kiwi", "Plum", "Pear", "Pomegranate", "Coconut",
            "Papaya", "Dragon Fruit", "Apricot", "Blackberry", "Gooseberry", "Tangerine", "Cantaloupe", "Mandarin", "Figs",
            "Guava", "Passion Fruit", "Starfruit", "Nectarine", "Mulberry", "Lychee", "Cranberries", "Date", "Jackfruit",
            "Salak", "Durian", "Persimmon", "Breadfruit", "Quince", "Loquat"
        ],
        Dairy: [
            "Milk", "Butter", "Yogurt", "Cheddar Cheese", "Parmesan", "Cream Cheese", "Sour Cream", "Heavy Cream", "Cottage Cheese",
            "Mozzarella", "Greek Yogurt", "Goat Cheese", "Ghee", "Buttermilk", "Ricotta", "Condensed Milk", "Evaporated Milk",
            "Half-and-Half", "Blue Cheese", "Feta Cheese", "Brie", "Camembert", "Swiss Cheese", "Gruyere", "Mascarpone", "Provolone",
            "Pecorino", "Ricotta Salata", "Muenster", "Fontina", "Asiago", "Queso Fresco", "Paneer", "Clotted Cream", "Whipped Cream",
            "Creamed Cheese", "Kefir", "Evaporated Milk"
        ],
        Meats: [
            "Beef", "Pork", "Lamb", "Bacon", "Sausage", "Ground Beef", "Steak", "Ham", "Veal", "Ribs", "Ground Pork", "Meatballs",
            "Venison", "Brisket", "Prosciutto", "Salami", "Duck Breast", "Goat", "Tri-Tip", "Pastrami", "Chorizo", "Ground Lamb",
            "Filet Mignon", "New York Strip", "Rib-eye", "Chuck Roast", "Top Sirloin", "T-bone", "Pork Tenderloin", "Spareribs",
            "Pork Belly", "Pork Chop", "Kielbasa", "Turkey Breast", "Cornish Hen", "Roast Duck", "Capicola", "Bresaola", "Pâté",
            "Lamb Shank", "Duck Leg", "Bison", "Rabbit", "Wild Boar", "Goose"
        ],
        Seafood: [
            "Salmon", "Shrimp", "Tuna", "Crab", "Cod", "Tilapia", "Mussels", "Clams", "Lobster", "Scallops", "Anchovies", "Oysters",
            "Sardines", "Mackerel", "Trout", "Octopus", "Squid", "Herring", "Swordfish", "Catfish", "Perch", "Halibut", "Snapper",
            "Sea Bass", "Flounder", "Kingfish", "Wahoo", "Prawn", "Crawfish", "Mahi-Mahi", "Tilapia", "Sole", "Lingcod", "Abalone",
            "Lobster Tail", "Geoduck", "Caviar", "Smelt", "Barramundi", "Pomfret"
        ],
        Spices: [
            "Salt", "Black Pepper", "Cumin", "Paprika", "Chili Powder", "Oregano", "Basil", "Parsley", "Thyme", "Rosemary", "Cinnamon",
            "Nutmeg", "Coriander", "Turmeric", "Ginger", "Sage", "Bay Leaf", "Fennel", "Curry Powder", "Allspice", "Tarragon", "Chive",
            "Cayenne Pepper", "Garlic Powder", "Onion Powder", "Dill", "Mustard Seed", "Cardamom", "Cloves", "Mace", "Lemongrass",
            "Marjoram", "Herbes de Provence", "Za'atar", "Cilantro", "Chili Flakes", "Chili Paste", "Sumac", "Paprika Smoked", "Star Anise",
            "Saffron", "Turmeric Root", "Fenugreek", "Curry Leaves", "Celery Seed", "Garam Masala", "Chinese Five Spice"
        ],
        Pasta: [
            "White Rice", "Brown Rice", "Quinoa", "Spaghetti", "Macaroni", "Oats", "Couscous", "Barley", "Farro", "Bulgur", "Ramen",
            "Soba Noodles", "Egg Noodles", "Fusilli", "Penne", "Linguine", "Orzo", "Gnocchi", "Polenta", "Wheat Berries", "Basmati Rice",
            "Jasmine Rice", "Arborio Rice", "Wild Rice", "Couscous", "Lasagna", "Fettuccine", "Pappardelle", "Cannelloni", "Tortellini",
            "Risotto Rice", "Bulgur Wheat", "Pine Nuts", "Malt", "Semolina", "Buckwheat", "Cereal Flakes", "Millet", "Teff", "Rye"
        ],
        Legumes: [
            "Lentils", "Chickpeas", "Black Beans", "Kidney Beans", "Pinto Beans", "Navy Beans", "Cannellini Beans", "Split Peas",
            "Edamame", "Green Peas", "Soybeans", "Mung Beans", "Fava Beans", "Black-eyed Peas", "White Beans", "Broad Beans", "Red Beans",
            "Adzuki Beans", "Great Northern Beans", "Lima Beans", "Chickpea Flour", "Pea Protein", "Peanut Butter", "Almond Butter",
            "Cashew Nuts", "White Bean Paste", "Pinto Bean Paste", "Tempeh", "Hummus"
        ],
        Oils: [
            "Olive Oil", "Vegetable Oil", "Canola Oil", "Soy Sauce", "Ketchup", "Mayonnaise", "Vinegar", "Hot Sauce", "Honey", "Mustard",
            "Balsamic Vinegar", "Sesame Oil", "Worcestershire Sauce", "Fish Sauce", "Tahini", "BBQ Sauce", "Sriracha", "Ranch Dressing",
            "Italian Dressing", "Maple Syrup", "Chili Oil", "Rice Vinegar", "Lemon Juice", "Soybean Oil", "Peanut Oil", "Mustard Seed",
            "Apple Cider Vinegar", "Coconut Milk", "Coconut Oil", "Ghee", "Mayo", "Pesto", "Buffalo Sauce", "Soy Sauce"
        ],
        Nuts: [
            "Almonds", "Peanuts", "Chia Seeds", "Sunflower Seeds", "Walnuts", "Cashews", "Pumpkin Seeds", "Hazelnuts", "Pecans",
            "Macadamia Nuts", "Hemp Seeds", "Pine Nuts", "Flax Seeds", "Sesame Seeds", "Brazil Nuts", "Mixed Nuts", "Nut Butter",
            "Peanut Butter", "Almond Butter", "Trail Mix", "Poppy Seeds", "Caraway Seeds", "Mustard Seeds", "Cucumber Seeds"
        ],
        Bakery: [
            "White Bread", "Whole Wheat Bread", "Tortilla", "Bread Rolls", "Bagels", "Pita Bread", "English Muffin", "Brioche", "Challah",
            "Naan", "Croissant", "Flatbread", "Sourdough", "Ciabatta", "French Bread", "Buns", "Cornbread", "Banana Bread", "Biscuits",
            "Focaccia", "Rye Bread", "Pumpernickel", "Multigrain Bread", "Focaccia Bread", "Crumpets", "Cinnamon Rolls"
        ],
        Baking: [
            "All-purpose Flour", "Baking Powder", "Baking Soda", "Yeast", "Sugar", "Vanilla Extract", "Cornstarch", "Cocoa Powder",
            "Powdered Sugar", "Molasses", "Cake Flour", "Self-rising Flour", "Cream of Tartar", "Shortening", "Gelatin", "Almond Flour",
            "Coconut Flour", "Brownie Mix", "Sprinkles", "Breadcrumbs", "Buttermilk", "Cornmeal", "Pecans", "Walnut Flour", "Graham Cracker"
        ]
    }
    const popupDelay = () => {
        setShowPopup(true);
        if (popupTimeoutRef.current) {
            clearTimeout(popupTimeoutRef.current); // Clear any previous timeout
        }
        
        popupTimeoutRef.current = setTimeout(() => {
            setShowPopup(false);
        }, 1000);
    }

    const clearAllIngredients = () => {
        setSelectedIngredients([]);
        popupDelay();
    };

    const handleIngredientChange = (ingredient) => {
        setSelectedIngredients((prevState) => {
            const isRemoving = prevState.includes(ingredient);
            const updatedIngredients = isRemoving
                ? prevState.filter(item => item !== ingredient)
                : [...prevState, ingredient];
    
            setLastSelectedIngredient({
                ingredientName: ingredient,
                action: isRemoving ? 'removed' : 'added'
            });

            popupDelay();
    
            return updatedIngredients;
        });
    };

    const fetchRecipes = async () => {
        const res = await fetch("http://localhost:5000/generate-recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients: selectedIngredients.join(",") }),
        });

        const data = await res.json();
        return data;
    };

    const recipeLinks = async () => {
        const ids = await fetchRecipes();

        const res = await fetch("http://localhost:5000/get-recipe-links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "recipe-ids": ids["recipe-ids"] })
        });

        const data = await res.json();
        setRecipes(data);
    };
    console.log(selectedIngredients);
    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EADBDD] font-sans">
            <div className="w-full max-w-6xl bg-white p-8 rounded-3xl shadow-xl">
                <div className="flex relative">
                    {/* Left Menu (Scrollable) */}
                    <div
                        className="w-64 h-[32rem] relative bg-cover bg-center rounded-lg mr-8"
                        style={{ backgroundImage: `url(${veggiesImage})` }}
                    >
                        {/* Overlay and Blur */}
                        <div className="absolute inset-0 bg-black opacity-10 rounded-lg"></div>
                        <div className="absolute inset-0 bg-opacity-20 backdrop-blur-sm rounded-lg"></div>

                        {/* Scrollable content */}
                        <div className="relative z-20 h-full flex flex-col overflow-y-auto p-3 space-y-4 pr-6 -mr-3">
                            {/*search bar with remove all button */}
                            <div className="flex items-center space-y-2">
                                <SearchBar onSelect={handleIngredientChange} selectedIngredients={selectedIngredients} />
                                <RemoveButton onClick={clearAllIngredients}/>
                            </div>
                            {Object.entries(ingredientsByCategory).map(([category, ingredients]) => (
                                <CategoryBox
                                    key={category}
                                    title={category}
                                    ingredients={ingredients.map(e => e.toLowerCase())}
                                    selectedIngredients={selectedIngredients}
                                    onSelectIngredient={handleIngredientChange}
                                />
                            ))}
                            {/* Spacer to push button down */}
                            <div className="flex-grow" />

                            <button
                                onClick={recipeLinks}
                                className="w-full bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700 transition duration-300"
                            >
                                Generează Rețete
                            </button>
                        </div>
                    </div>

                    {/* Main Area (Recipes) */}
                    <div className="flex-1 relative">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Recipes</h2>
                        <div id="recipe-list" className="space-y-6">
                            {recipes.length === 0 ? (
                                <p className="text-center text-gray-500">No recipes match the selected ingredients.</p>
                            ) : (
                                recipes.map((recipe, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            {recipe.sourceName}
                                        </h3>
                                        <p className="text-gray-600">
                                            <strong>Ingredients:</strong> {recipe.readyInMinutes}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                        <Popup show={showPopup}
                               message={selectedIngredients.length === 0 ? "trash" : lastSelectedIngredient}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeFinder;
