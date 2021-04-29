import * as React from "react";
import { motion, useInvertedScale } from "framer-motion";
import {  openSpring } from "./animation";

import Button from '@material-ui/core/Button';
import {
    setSelectedImg
  } from "../features/userSlice";
  import { useDispatch } from "react-redux";

export const Title = ({  isSelected }) => {
  const dispatch = useDispatch();
  const handleClick = (e => {
      console.log(e)
      dispatch(setSelectedImg(null))
  })
  const inverted = useInvertedScale();
  const x = 30 ;
  const y = x;
  if (!isSelected) return null;

  return (
    <motion.div
      className="title-container"
      initial={false}
      animate={{ x, y }}
      transition={ openSpring}
      transformTemplate={scaleTranslate}
      style={{ ...inverted, originX: 0, originY: 0 }}
    >
      {/* <span className="category">{category}</span> */}
      <Button variant="contained" color="secondary" onClick={handleClick}>Close</Button>
      {/* <h2>
        Image 
      </h2> */}
    </motion.div>
  );
};

/**
 * `transform` is order-dependent, so if you scale(0.5) before translateX(100px),
 * the visual translate will only be 50px.
 *
 * The intuitive pattern is to translate before doing things like scale and
 * rotate that will affect the coordinate space. So Framer Motion takes an
 * opinion on that and allows you to animate them
 * individually without having to write a whole transform string.
 *
 * However in this component we're doing something novel by inverting
 * the scale of the parent component. Because of this we want to translate
 * through scaled coordinate space, and can use the transformTemplate prop to do so.
 */
const scaleTranslate = ({ x, y, scaleX, scaleY }) =>
  `scaleX(${scaleX}) scaleY(${scaleY}) translate(${x}, ${y}) translateZ(0)`;
