import * as React from 'react';
import { memo, useRef }  from "react";
import {
  selectImg,
  setSelectedImg
} from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { motion, useMotionValue } from "framer-motion";

import { useInvertedBorderRadius } from "../utils/use-inverted-border-radius";

import { ContentPlaceholder } from "./Taskbar.jsx";
import { Title } from "./TitleImg";
import { Image } from "./Image";
import { openSpring, closeSpring } from "./animation";
import { useScrollConstraints } from "../utils/use-scroll-constraints";
import { useWheelScroll } from "../utils/use-wheel-scroll";


const Modal = memo(() => {
  const dispatch = useDispatch();
  const isSelected = useSelector(selectImg);    //getting the selected image by the user
  const y = useMotionValue(0);
  const zIndex = useMotionValue(2);
 

   const dismissDistance = 150;
 
  const inverted = useInvertedBorderRadius(40);

 
  const cardRef = useRef(null);
  const constraints = useScrollConstraints(cardRef, isSelected);

  function checkSwipeToDismiss() {
    y.get() > dismissDistance && dispatch(setSelectedImg(null));
  }

  function checkZIndex(latest) {
    if (isSelected) {
      zIndex.set(2);
    } else if (!isSelected && latest.scaleX < 1.01) {
      zIndex.set(0);
    }
  }

 
  const containerRef = useRef(null);
  useWheelScroll(
    containerRef,
    y,
    constraints,
    checkSwipeToDismiss,
    isSelected
  );
 
 
  return (
    <>
   <div ref={containerRef} className={`card`} >
    <Overlay isSelected={isSelected} />
  
    <div className={`card-content-container open `} >
  
          <motion.div
            ref={cardRef}
            className="card-content  "
            style={{ ...inverted, zIndex, y }}
            layoutTransition={isSelected ? openSpring : closeSpring}
            drag={'y'}
            dragConstraints={constraints}
            onDrag={checkSwipeToDismiss}
            onUpdate={checkZIndex}
          >
             
            <Image
              // id={id}
              isSelected={isSelected}
              setSelectedImg={setSelectedImg}
            
            />
           <Title  isSelected={isSelected} />
           
            <ContentPlaceholder setSelectedImg={setSelectedImg}/> 
          </motion.div>
       
        </div>
        </div>
    </>
  )
})

const Overlay = ({ isSelected }) => (
  <motion.div
    initial={false}
    animate={{ opacity: isSelected ? 1 : 0 }}
    transition={{ duration: 0.2 }}
    style={{ pointerEvents: "auto" }}
    className="overlay"
  >
    {/* <Link to="/" /> */}
  </motion.div>
);


export default Modal;