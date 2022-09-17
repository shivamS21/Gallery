import * as React from "react";
import { motion, useInvertedScale } from "framer-motion";
import { closeSpring } from "./animation";
import {
    selectImg
  } from "../features/userSlice";
import { useSelector } from "react-redux";
import '../styling/styles.css';
export const Image = ({
  id=1,
  pointOfInterest = 0,
  backgroundColor="grey"
}) => {
  const inverted = useInvertedScale();
  const SelectedImg = useSelector(selectImg);
  
  return (
    <motion.div
      className="card-image-container "
      style={{ ...inverted, backgroundColor, originX: 0, originY: 0 }}
    >  
      <motion.img
        className="card-image"
        src={SelectedImg}
        alt="Enlarged pic"
        initial={false}
        transition={closeSpring}
      />
    </motion.div>
  );
};
