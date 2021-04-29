import React from 'react';
import useFirestore from '../hooks/useFirestore';
import { motion } from 'framer-motion';
import {
  setSelectedImg,
  setSelectedImgId
} from "../features/userSlice";
import { useDispatch } from "react-redux";
const ImageGrid = () => {

  const { docs } = useFirestore('images');
  const dispatch = useDispatch();

  const changeUrlId=(url,id,message)=>{
   
    dispatch(setSelectedImg(message));
    dispatch(setSelectedImgId(id));
        
   
  }
  return (
    <div className="img-grid">
      {docs && docs.map(doc => (
        <motion.div className="img-wrap" key={doc.id} 
          layout
          whileHover={{ opacity: 1 }}s

          onClick={() => changeUrlId(doc.url, doc.id,doc.string)}
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