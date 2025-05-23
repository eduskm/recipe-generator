import { CiUser } from "react-icons/ci";
import { motion } from 'framer-motion';

export default function UserButton() {
    return(
        <motion.button
        className="p-1 bg-gray-500 text-white rounded-full hover:bg-blue-600 transition duration-300 transform focus:outline-none"
        aria-label="Clear all ingredients"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 0.9 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.01 }}
        whileHover={{scale: 1}}
        whileTap={{scale: 0.9}}
      >
        <CiUser/>
      </motion.button>
    );
}