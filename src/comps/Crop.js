import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    'image/png',
    1
  );
}

export default function Crop() {
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [circle,setCircle]=useState(false)
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {console.log(reader.result);setUpImg(reader.result)});
      reader.readAsDataURL(e.target.files[0]);
    }
  };

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
     
  function getBase64Image(imgUrl, callback) {
    // console.log(imgUrl)
    var img = new Image();

    // onload fires when the image is fully loadded, and has width and height

    img.onload = function(){

      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
    dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

      callback(dataURL); // the base64 string

    };

    // set attributes and src 
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = imgUrl;

}


  const loadCanvas = () => {
    const url="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
    getBase64Image(url, function(base64image){

        // console.log(base64image);
        setUpImg("data:image/png;base64,"+base64image)
        
   });
        
}

useEffect(() => {
    loadCanvas() 
}, [])

  
  return (
    <div style={{padding:"3%"}}>
      <div>
        <button onClick={c=>{setCircle(false)
          setCrop({ unit: '%', width: 30, aspect: 16/ 9 })}}>Rectangle</button>
        <button onClick={c=>{setCircle(false)
          setCrop({ unit: '%', width: 30, aspect: 9 / 9 })}}>Square</button>
        <button onClick={c=>{
          setCircle(true)
          setCrop({ unit: '%', width: 30, aspect: 9 / 9 })}}>Circle</button>
      </div>
      {/* <div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
      </div> */}
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
    
      <button
        type="button"
        disabled={!completedCrop?.width || !completedCrop?.height}
        onClick={() =>
          generateDownload(previewCanvasRef.current, completedCrop)
        }
      >
        Download cropped image
      </button>
    </div>
  );
}
