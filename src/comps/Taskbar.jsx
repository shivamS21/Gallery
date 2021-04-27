import * as React from "react";
import {useEffect,useState} from 'react'
import { motion, useInvertedScale } from "framer-motion";
import Button from '@material-ui/core/Button';
import axios from 'axios'
import https from 'https'
import {
  selectImg,
  setSelectedImg
} from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import '../styling/styles.css';
import {saveAs} from 'file-saver'
import Blob from 'blob'
import ImgFilter from "./FilterModel";


// const httpsAgent = new https.Agent({ rejectUnauthorized: false });
export const ContentPlaceholder = React.memo(() => {
  const inverted = useInvertedScale();
  const [image,setImage]=useState();
  const dispatch = useDispatch();
 
  const SelectedImg = useSelector(selectImg);
  // console.log(setSelectedImg?'exists':'not')
  async function download(){
    const {data}=await axios.get("http://localhost:8000/download")
    // console.log(data.type)
    const base64String = btoa(String.fromCharCode(...new Uint8Array(data.name.data)));
    const link = document.createElement('a');
    link.href = 'data:application/octet-stream;base64,' + base64String;
    link.setAttribute('download', data.type)
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }


  
  return (
    <motion.div
      className="content-container"
      style={{ ...inverted, originY: 0, originX: 0 }}
    > 
    
      
      <Button variant="contained" color="secondary" onClick={download}>Crop</Button>
      <ImgFilter/>
      <Button variant="contained" color="secondary" onClick={download}>Delete</Button>
      <Button variant="contained" color="secondary" onClick={download}>Download</Button>
      

      
    </motion.div>
  );
});


