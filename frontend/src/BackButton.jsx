import { IoArrowBackSharp } from "react-icons/io5";
import { motion } from 'framer-motion';

export default function BackButton({onClick}) {
    return(
        <motion.button
        onClick={onClick}
        className="p-2 bg-gray-400 text-white rounded-full hover:bg-gray-700 transition duration-300 transform focus:outline-none"
        aria-label="Clear all ingredients"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 0.9 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.01 }}
        whileHover={{scale: 1}}
        whileTap={{scale: 0.9}}
      >
        <IoArrowBackSharp/>
      </motion.button>
    );
}