import React from 'react';
import useStorageBase from '../hooks/useStorageBase';
import { motion } from 'framer-motion';

const ProgressBar = ({message,name }) => {

  const { progress} = useStorageBase(message,name);
  
  return (
    <motion.div className="progress-bar output"
      initial={{ width: 0 }}
      animate={{ width: progress + '%' }}
    ></motion.div>
  );
} 

export default ProgressBar;