import React from "react";

import ImageUploading from "react-images-uploading";
import 'fabric-webpack'
import DesignCanvas from './DesignCanvas'
import Button from '@material-ui/core/Button';
import Image from './Image'
import "./styles.css";

export default function Uplaod() {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const onChange = (imageList) => {
    // data for submit
    // console.log(addUpdateIndex);
    setImages(imageList);
  };


  // console.log(images)
  return (
    <div className="collage">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({ onImageUpload, onImageRemove, onImageUpdate }) => (
          // write your building UI
        
          <div className="upload__image-wrapper">
          <Button variant="contained" color="secondary" onClick={onImageUpload}>UPLOAD MULTIPLE IMAGES</Button>
            &nbsp;
            
          <DesignCanvas>
        {images.map((image,index) => (
 <Image
 key={index}
 url={image.data_url}
 crossOrigin=""
 scale={0.2}
 top={100}
/>
            ))}
      
     
    </DesignCanvas>
          </div>
          
        )}
      </ImageUploading>
    </div>
  );
}

