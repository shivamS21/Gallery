import { useState, useEffect } from 'react';
import { projectStorage, projectFirestore, timestamp } from '../firebase/config';
import { useSelector } from "react-redux";
import{ selectUserData } from "../features/userSlice";

  
const useStorageBase = (message,name) => {

  const emailID = useSelector(selectUserData)?.email;
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
   

  useEffect( () => {
    (async ()=>{
     
      const storageRef = projectStorage.ref(name);
      const collectionRef = projectFirestore.collection('images');
      storageRef.putString(message, 'data_url').on('state_changed', (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      }, (err) => {
        setError(err);
      }, async () => {
       
        const url = await storageRef.getDownloadURL();
        const createdAt = timestamp();
        await collectionRef.add({ email: emailID, url, createdAt,string:message });
     
        // setUrl(url);
      });
    })()
    // references
  
  }, [message, emailID, name]);

  return { progress, error };
}

export default useStorageBase;