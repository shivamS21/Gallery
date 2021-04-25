import React from 'react';
import useFirestore from '../hooks/useFirestore';
import { motion } from 'framer-motion';
import {
  selectSignedIn,
  selectImg,
  setSelectedImg
} from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
const ImageGrid = () => {
  const { docs } = useFirestore('images');
  const dispatch = useDispatch();
  return (
    <div className="img-grid">
      {docs && docs.map(doc => (
        <motion.div className="img-wrap" key={doc.id} 
          layout
          whileHover={{ opacity: 1 }}s
          onClick={() => dispatch(setSelectedImg(doc.url))}
        >
          <motion.img src={doc.url} alt="uploaded pic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default ImageGrid;