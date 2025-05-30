import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import './index.css';
const suggestionsList = ['mango', 'sweet corn', 'olive oil', 'orzo', 'kefir', 'pinto bean paste', 'rosemary', 'cinnamon rolls', 'egg noodles', 'sumac', 'hot sauce', 'italian dressing', 'tortilla', 'pork belly', 'black beans', 'paprika', 'herring', 'tempeh', 'canola oil', 'yeast', 'trail mix', 'jackfruit', 'garlic powder', 'goat', 'fontina', 'white bean paste', 'white rice', 'flounder', 'mung bean sprouts', 'rice vinegar', 'sausage', 'provolone', 'pomegranate', 'turnip', 'prawn', 'snapper', 'ricotta', 'shrimp', 'loquat', 'lemon juice', 't-bone', 'cayenne pepper', 'shortening', 'lettuce', 'guava', 'blue cheese', 'coconut', 'jalapeno', 'ham', 'breadfruit', 'smelt', 'gruyere', 'quince', 'star anise', 'bbq sauce', 'blackberry', 'milk', 'black-eyed peas', 'sole', 'watermelon', 'linguine', 'ketchup', 'mulberry', 'buns', 'tahini', 'marjoram', 'cottage cheese', 'goose', 'fish sauce', 'peanut butter', 'bagels', 'focaccia bread', 'lingcod', 'tangerine', 'brussels sprouts', 'soba noodles', 'kielbasa', 'navy beans', 'green peas', 'mandarin', 'ground beef', 'mascarpone', 'mustard', 'breadcrumbs', 'cod', 'adzuki beans', 'walnut flour', 'caraway seeds', 'sesame oil', 'feta cheese', 'chili pepper', 'baking soda', 'rib-eye', 'black pepper', 'hummus', 'multigrain bread', 'orange', 'biscuits', 'brie', 'crab', 'artichoke', 'focaccia', 'mustard seed', 'saffron', 'scallops', 'cauliflower', 'brioche', 'ranch dressing', 'gnocchi', 'oats', 'penne', 'cornbread', 'baking powder', 'teff', 'cashews', 'whole wheat bread', 'red beans', 'cucumber seeds', 'sea bass', 'apple cider vinegar', 'salami', 'caviar', 'paprika smoked', 'fava beans', 'spinach', 'peanut oil', 'banana', 'cherry', 'top sirloin', 'broccoli', 'lamb', 'potato', 'zucchini', 'almond flour', 'english muffin', 'pork chop', 'chia seeds', 'malt', 'broad beans', 'bison', 'ciabatta', 'cranberries', 'curry leaves', 'garam masala', 'rye', 'cantaloupe', 'beetroot', 'geoduck', 'turmeric', 'mixed nuts', 'taro', 'turkey breast', 'hazelnuts', 'mushrooms', 'maple syrup', 'cereal flakes', 'carrot', 'rye bread', 'raspberry', 'bell pepper', 'naan', 'tomato', 'chili flakes', 'cream cheese', 'apricot', 'cornstarch', 'celery seed', 'parmesan', 'yam', 'chorizo', 'date', 'ribs', 'meatballs', 'perch', 'catfish', 'crawfish', 'sardines', 'pecorino', 'passion fruit', 'figs', 'butternut squash', 'coriander', 'starfruit', 'cucumber', 'basil', 'chili powder', 'kale', 'arugula', 'abalone', 'oysters', 'gooseberry', 'queso fresco', 'roast duck', 'soybean oil', 'okra', 'pastrami', 'nectarine', 'worcestershire sauce', 'arborio rice', 'sage', 'butter', 'chive', 'wahoo', 'coconut flour', 'sriracha', 'pesto', 'rutabaga', 'lemon', 'graham cracker', 'lobster tail', 'muenster', 'whipped cream', 'rabbit', 'spareribs', 'beef', 'ground pork', 'pea protein', 'papaya', 'parsnip', 'oregano', 'strawberry', 'ghee', 'dill', 'avocado', 'brazil nuts', 'persimmon', 'cannellini beans', 'evaporated milk', 'flax seeds', 'clotted cream', 'mackerel', 'buckwheat', 'peanuts', 'croissant', 'kingfish', 'pork', 'ricotta salata', 'eggplant', 'fenugreek', 'cake flour', 'semolina', 'fennel', 'pomfret', 'mussels', 'vinegar', 'cornish hen', 'gelatin', 'bresaola', 'soybeans', 'peach', 'sour cream', 'cumin', 'coconut milk', 'nutmeg', 'pinto beans', 'sunflower seeds', 'tuna', 'mung beans', 'macaroni', 'sourdough', 'lasagna', 'fettuccine', 'onion powder', 'jasmine rice', 'squid', 'capicola', 'halibut', 'onion', 'tilapia', 'duck leg', 'buffalo sauce', 'crumpets', 'cream of tartar', 'mozzarella', 'salmon', 'farro', 'mustard seeds', 'buttermilk', 'nut butter', 'bulgur wheat', 'cashew nuts', 'apple', 'pecans', 'venison', 'watercress', 'cinnamon', 'pear', 'chayote', 'self-rising flour', 'cardamom', 'almond butter', 'swordfish', 'lychee', 'tatsoi', 'split peas', 'flatbread', 'lima beans', 'white beans', 'ramen', 'cabbage', 'blueberry', 'pumpernickel', 'green beans', 'filet mignon', 'wheat berries', 'all-purpose flour', 'wild rice', 'duck breast', 'soy sauce', 'french bread', 'swiss cheese', 'almonds', 'powdered sugar', 'molasses', 'asparagus', 'mahi-mahi', 'vanilla extract', 'brown rice', 'walnuts', 'lentils', 'ground lamb', 'spaghetti', 'chinese five spice', 'parsley', "za'atar", 'greek yogurt', 'camembert', 'lemongrass', 'clams', 'barley', 'dragon fruit', 'pineapple', 'grapes', 'kiwi', 'yogurt', 'tarragon', 'tortellini', 'chili oil', 'bay leaf', 'quinoa', 'anchovies', 'bread rolls', 'octopus', 'pumpkin seeds', 'chickpeas', 'white bread', 'bamboo shoots', 'bacon', 'sesame seeds', 'pita bread', 'poppy seeds', 'wild boar', 'cocoa powder', 'basmati rice', 'heavy cream', 'risotto rice', 'asiago', 'salak', 'chuck roast', 'chili paste', 'pine nuts', 'plum', 'salt', 'brownie mix', 'cannelloni', 'ginger', 'hemp seeds', 'couscous', 'half-and-half', 'thyme', 'honey', 'cloves', 'tri-tip', 'coconut oil', 'mayo', 'garlic', 'curry powder', 'barramundi', 'brisket', 'edamame', 'great northern beans', 'kohlrabi', 'sprinkles', 'paneer', 'pappardelle', 'polenta', 'goat cheese', 'cilantro', 'fusilli', 'millet', 'herbes de provence', 'squash', 'steak', 'chickpea flour', 'condensed milk', 'leek', 'challah', 'durian', 'celery', 'pâté', 'cornmeal', 'kidney beans', 'macadamia nuts', 'creamed cheese', 'lobster', 'new york strip', 'radish', 'lime', 'lamb shank', 'chard', 'veal', 'cheddar cheese', 'turmeric root', 'bulgur', 'sugar', 'pumpkin', 'banana bread', 'mace', 'trout', 'pork tenderloin', 'vegetable oil', 'prosciutto', 'balsamic vinegar', 'sweet potato', 'allspice', 'sunflower oil', 'tomato paste'];

export default function SearchBar({ query, setQuery, showSuggestions, setShowSuggestions, onSelect, selectedIngredients}) {
  
    const filteredSuggestions = suggestionsList.filter((item) =>
      item.toLowerCase().startsWith(query.toLowerCase())
    );
  
    const handleChange = (e) => {
      const value = e.target.value;
      const trimmed = value.trim();
      console.log("value:", value, "trimmed:", trimmed, "show?", trimmed.length > 0);
      setQuery(value);
      setShowSuggestions(trimmed.length > 0);
      console.log(trimmed.length > 0);
    };
  
    const handleSelect = (item) => {
      setQuery("");
      setShowSuggestions(false);
      if (onSelect) {
        onSelect(item); // Send the selected item to parent
      } 
    };
  
    return (
      <div className="relative w-full max-w-md mx-auto mt-2 ">
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="search ingredients"
          className="p-3 rounded-xl shadow-md white-placeholder text-white"
        />
  
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-10 w-full text-black bg-white shadow-lg border border-white-200 text-center max-h-90 overflow-y-auto"
            >
              {filteredSuggestions.slice(0, 6).map((item) => (
                <li
                  key={item}
                  onClick={() => handleSelect(item)}
                  className="p-3 hover:bg-white-500 cursor-pointer text-xs "
                >
                  {item}
                  {selectedIngredients.includes(item)   
                  ? <span className="text-red-600 font-bold text-sm ml-2">-</span> 
                  : <span className="text-green-600 font-bold text-sm ml-2">+</span>}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  }
  
