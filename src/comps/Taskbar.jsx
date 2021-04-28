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
import ProgressBar from "./ProgressBarBase"
export const ContentPlaceholder = React.memo(() => {
  const inverted = useInvertedScale();
  const SelectedImg = useSelector(selectImgId);
  const SelectImg=useSelector(selectImg);
  const [Save,SetSave]=React.useState(false)
  const dispatch = useDispatch();
  const handleClick=(e)=>{
    projectFirestore.collection("images").doc(SelectedImg).delete().then(() => {
        console.log("Document successfully deleted!");
        dispatch(setSelectedImg(null))

    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
  }

  const handleDownload=()=>{
    const downloadLink = document.createElement("a");
    const fileName = "image.png";
    downloadLink.href = SelectImg;
    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove();
  }

  
  const handleSave=()=>{
 
    SetSave(true)
  }

  return (
    
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    >
      { Save && <ProgressBar message={SelectImg} name={SelectedImg} />}
      <ImgCrop/>
      <ImgFilter/>
      <Button variant="contained" color="secondary" onClick={handleClick}>Delete</Button>
      <Button variant="contained" color="secondary" onClick={handleDownload}>Downlaod</Button>
      <Button variant="contained" color="secondary" onClick={handleSave}>Save</Button>
      
    </motion.div>
  );
});
