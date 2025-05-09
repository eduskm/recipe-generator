
import { useState } from "react";
import './App.css';

export default function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");

  const handleAddIngredient = () => {
    if (input.trim() !== "") {
      setIngredients([...ingredients, input.trim()]);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  return (
    <div className="ingredients-container">
      <h2 className="ingredients-title">Your Ingredients</h2>
      <div className="ingredients-input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an ingredient..."
          className="ingredient-input"
        />
      </div>
      <ul className="ingredients-list">
        {ingredients.map((item, index) => (
          <li key={index} className="ingredient-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}