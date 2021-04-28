import React from "react";
import ReactDOM from "react-dom";
import ImageUploading from "react-images-uploading";
import 'fabric-webpack'
import DesignCanvas from './DesignCanvas'
import Button from '@material-ui/core/Button';
import Image from './Image'
import "./styles.css";

export default function Uplaod() {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    // console.log(addUpdateIndex);
    setImages(imageList);
  };
  const onImageRemoveAll = () => {
    setImages([]);
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
          <div>
          <div className="upload__image-wrapper">
          <Button variant="contained" color="secondary" onClick={onImageUpload}>Click</Button>
            &nbsp;
            
          <DesignCanvas>
        {images.map(image => (
 <Image
 url={image.data_url}
 crossOrigin=""
 scale={0.2}
 top={100}
/>
            ))}
      
     
    </DesignCanvas>
          </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

