import { CiUser } from "react-icons/ci";
import { motion } from 'framer-motion';

export default function UserButton({onClick}) {
    return(
        <motion.button
        onClick={onClick}
        className="transition duration-300 transform flex items-center text-sm font-medium rounded-lg hover:bg-gray-100 text-gray-600"
        aria-label="Clear all ingredients"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 0.9 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.01 }}
        whileHover={{scale: 1}}
        whileTap={{scale: 0.9}}
      >
        my account
      </motion.button>
    );
} 