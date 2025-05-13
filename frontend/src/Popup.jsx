// Popup.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Popup = ({ show, message, removedIngredients }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <div className="bg-white border shadow-lg rounded-xl px-6 py-4 w-full max-w-md text-center">
                        <p className="text-gray-800">
                          {message === "trash" ? "removed all ingredients" : (
                            <>
                            {message.ingredientName}{' '}
                            <span className={message.action === "removed" ? "text-red-600" : "text-green-600"}>
                                {message.action}
                            </span>
                            </>
                            )}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Popup;