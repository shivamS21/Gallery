import * as React from "react";
import { motion, useInvertedScale } from "framer-motion";
import { projectFirestore } from '../firebase/config';
import {
  selectImgId,
  selectImg,
  setSelectedImg
} from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";
import Button from '@material-ui/core/Button';
import ImgFilter from "./FilterModel";
import ImgCrop from "./CropModel";
export const ContentPlaceholder = React.memo(() => {
  const inverted = useInvertedScale();
  const SelectedImg = useSelector(selectImgId);
  const dispatch = useDispatch();
  const handleClick=(e)=>{
    projectFirestore.collection("images").doc(SelectedImg).delete().then(() => {
        console.log("Document successfully deleted!");
        dispatch(setSelectedImg(null))

    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
  }
  return (
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    >
      <ImgCrop/>
      <ImgFilter/>
      <Button variant="contained" color="secondary" onClick={handleClick}>Delete</Button>
      <button> Download</button>
    </motion.div>
  );
});
