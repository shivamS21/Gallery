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
import ProgressBar from "./ProgressBarBase";
export const ContentPlaceholder = React.memo(() => {
  const inverted = useInvertedScale();
  const SelectedImg = useSelector(selectImgId);
  const SelectImg=useSelector(selectImg);
  const [Save,SetSave]=React.useState(false)
  const dispatch = useDispatch();
  const offScreen=()=>{
    dispatch(setSelectedImg(null));
  }
  const handleClick=(e)=>{
    projectFirestore.collection("images").doc(SelectedImg).delete().then(() => {
        console.log("Document successfully deleted!");
        offScreen();
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
    SetSave(true);
    // offScreen();
  }

  return (
    
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    >
      <div>
            { Save && <ProgressBar message={SelectImg} name={SelectedImg} />}
      </div>
      <div style={{display:"flex","justifyContent":"space-between","alignItems":"center"}} >
        <div style={{marginRight:"1%"}}><ImgFilter/></div>
        <div style={{marginLeft:"1%",marginRight:"1%"}} ><ImgCrop/></div>
        <div style={{marginLeft:"1%",marginRight:"1%"}} ><Button variant="outlined" color="primary" onClick={handleDownload}>Downlaod</Button></div>
        <div style={{marginLeft:"1%",marginRight:"1%"}} ><Button variant="outlined" color="primary" onClick={handleSave}>Save</Button></div>
        <div style={{marginLeft:"1%"}} ><Button variant="outlined" color="primary" onClick={handleClick}>Delete</Button></div>  
      </div>
      
    </motion.div>
  );
});
