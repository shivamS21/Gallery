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
  // console.log(setSelectedImg?'exists':'not')
  // console.log(SelectedImg)
  
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
        // animate={ { x:-20,y:-20}
        //     // setSelectedImg ? { x: -20, y: -20 } : { x: -pointOfInterest, y: 0 }
        // }
        transition={closeSpring}
      />
    </motion.div>
  );
};
