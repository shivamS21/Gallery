import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from '@material-ui/core/Button';
import {
  selectImgId,
  selectImg,
  setSelectedImg,
} from "../features/userSlice";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
 
  buttons: {
    display:"flex",
    justifyContent:"space-around",
    alignItems:"center",
    marginBottom:"2%",
    
    
  },
}));

function generateDownload(canvas, crop) {
  if (!crop || !canvas) {
    return;
  }

  canvas.toBlob(
    (blob) => {
      const previewUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.download = 'cropPreview.png';
      anchor.href = URL.createObjectURL(blob);
      // console.log(anchor.href)
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    'image/png',
    1
  );
}


export default function Crop() {

  const classes = useStyles();
  const dispatch = useDispatch();
  const SelectedImg = useSelector(selectImg);
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [circle,setCircle]=useState(false)


  function handleSave(canvas, crop){
    if (!crop || !canvas) {
      return;
    }
   
    var pngUrl = canvas.toDataURL();
    dispatch(setSelectedImg(pngUrl))
    
    // console.log(pngUrl)
  }

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    if(circle){
      ctx.beginPath();
    ctx.arc(
      (crop.width) / 2,
      (crop.height) / 2,
      (crop.width)/ 2,
      0,
      Math.PI * 2,
      false
    );
    ctx.strokeStyle = "#2465D3";
    ctx.stroke();
    ctx.clip();
    }
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }, [completedCrop]);
   

useEffect(() => {
  (async()=>{
    setUpImg(SelectedImg)
  })()
 
   
}, [])

  
  return (
    <div style={{padding:"3%"}}>
      <div className={classes.buttons}>
      <Button autoFocus variant="contained" color="secondary" onClick={c=>{setCircle(false)
          setCrop({ unit: '%', width: 30, aspect: 16/ 9 })}}> 
              Rectangle
      </Button>
     
       <Button autoFocus variant="contained" color="secondary" onClick={c=>{setCircle(false)
          setCrop({ unit: '%', width: 30, aspect: 9 / 9 })}}>Square  </Button>
       <Button autoFocus variant="contained" color="secondary" onClick={c=>{
          setCircle(true)
          setCrop({ unit: '%', width: 30, aspect: 9 / 9 })}}>Circle  </Button>
        <Button autoFocus variant="contained" color="secondary"  disabled={!completedCrop?.width || !completedCrop?.height} onClick={()=>handleSave(previewCanvasRef.current, completedCrop)}>Save </Button>
        <Button autoFocus variant="contained" color="secondary"
        disabled={!completedCrop?.width || !completedCrop?.height}
        onClick={() =>
          generateDownload(previewCanvasRef.current, completedCrop)
        }  >
        Download
        </Button>
      </div>
      
    
      <ReactCrop
        src={upImg}
        onImageLoaded={onLoad}
        crop={crop}
        circularCrop={circle}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
      />
      <div>
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
            borderRadius:(circle?"50%":"")
          }}
        />
      </div>
    
      
    </div>
  );
}
