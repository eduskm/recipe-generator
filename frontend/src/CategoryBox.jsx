  import React, { useState, useEffect } from "react";
  import { motion, AnimatePresence } from "framer-motion";

  export default function CategoryBox({
    title,
    ingredients,
    selectedIngredients,
    onSelectIngredient,
  }) {
    const maxToShow = 8;
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleItems = isExpanded
      ? ingredients : ingredients.slice(0, maxToShow); 

    const remainingCount = ingredients.length - maxToShow;

    useEffect(() => {
      const shouldChange = ingredients.some((item) => {
        return selectedIngredients.includes(item) && !visibleItems.includes(item)
      });

      if(shouldChange) {
        toggleExpanded();
      }
    }, [selectedIngredients]);
    
    const handleClick = (ingredient) => {
      onSelectIngredient(ingredient);
    };

    const toggleExpanded = () => {
      setIsExpanded((prev) => !prev);
    };

    return (
      <div className="max-w-md bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <span className="text-gray-500 text-sm">
            {selectedIngredients.filter((item) => ingredients.includes(item))
              .length}
            /{ingredients.length}
          </span>
        </div>

        <motion.div
          layout
          className="flex flex-wrap gap-2 overflow-hidden"
          transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
        >
          <AnimatePresence>
            {visibleItems.map((item, index) => {
              const isSelected = selectedIngredients.includes(item);
              return (
                <motion.span
                  key={index}
                  onClick={() => handleClick(item)}
                  className={`cursor-pointer px-3 py-1 text-sm rounded ${
                    isSelected
                      ? "bg-green-200 text-green-800 font-semibold"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  {item.toLowerCase()}
                </motion.span>
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {!isExpanded && remainingCount > 0 && (
              <motion.span
                key="more-button"
                onClick={toggleExpanded}
                className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded cursor-pointer hover:bg-gray-200"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                +{remainingCount} More
              </motion.span>
            )}

            {isExpanded && (
              <motion.span
                key="less-button"
                onClick={toggleExpanded}
                className="text-sm text-blue-600 cursor-pointer underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Show Less
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }
