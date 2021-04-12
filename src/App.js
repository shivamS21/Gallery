import React, { useState } from 'react';
import Title from './comps/Title';
import UploadForm from './comps/UploadForm';
import ImageGrid from './comps/ImageGrid';
import Modal from './comps/Modal';
import Navbar from './comps/Navbar';
import { useDispatch, useSelector } from "react-redux";
import {
  selectSignedIn,
} from "./features/userSlice";
function App() {
  const [selectedImg, setSelectedImg] = useState(null);
  const isSignedIn = useSelector(selectSignedIn);
  return (
    <div className="App">
      <Navbar/>
      <Title/>
      {isSignedIn ? (
      <div>
      <UploadForm />
      <ImageGrid setSelectedImg={setSelectedImg} />
      { selectedImg && (
        <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} />
      )} 
      </div>):("")}
    </div>
  );
}

export default App;
