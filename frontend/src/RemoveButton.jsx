  import { FaRegTrashCan } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const RemoveButton = ({ onClick}) => (
  <motion.button
    onClick={onClick}
    className="ml-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 transform focus:outline-none"
    aria-label="Clear all ingredients"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.01 }}
    whileHover={{scale: 1.1}}
    whileTap={{scale: 0.9}}
  >
    <FaRegTrashCan/>
  </motion.button>
);

export default RemoveButton;