import React, { useState } from 'react';
import Title from './comps/Title';
import UploadForm from './comps/UploadForm';
import ImageGrid from './comps/ImageGrid.js';
import Modal from './comps/Modal';
import Navbar from './comps/Navbar';
// import Example from './comps/FilterImg'
// import Demo from './comps/Crop'

import { useSelector } from "react-redux";
import {
  selectSignedIn,
  selectImg
} from "./features/userSlice";
function App() {
  // const [selectedImg, setSelectedImg] = useState(null);
  const isSignedIn = useSelector(selectSignedIn);
  const selectedImg = useSelector(selectImg);
  

  return (
    <div className="App">
      <Navbar/>
      <Title/>
      
      {isSignedIn ? (
      <div>
      <UploadForm />
      <ImageGrid  /> 
      { selectedImg?(
        <Modal />
      ):""}  
      </div>):("")} 
    </div>
  );
}

export default App;
