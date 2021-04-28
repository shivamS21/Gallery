import { useState, useEffect } from 'react';
import { projectStorage, projectFirestore, timestamp } from '../firebase/config';
import { useSelector } from "react-redux";
import{ selectUserData } from "../features/userSlice";
const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

async function Main(files) {
  const file = await toBase64(files);  
  console.log(file)
  return file;
}
const useStorage = (file) => {
  const emailID = useSelector(selectUserData)?.email;
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    // references
    const storageRef = projectStorage.ref(file.name);
    const collectionRef = projectFirestore.collection('images');
    
    storageRef.put(file).on('state_changed', (snap) => {
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      setProgress(percentage);
    }, (err) => {
      setError(err);
    }, async () => {
      const url = await storageRef.getDownloadURL();
      const base64Image = Main(file);
      // , base64str:"data:image/png;base64,"+ base64Image
      console.log('check1',base64Image)
      
      const createdAt = timestamp();
      await collectionRef.add({ email: emailID, url, createdAt });
      setUrl(url);
    });
  }, [file, emailID]);

  return { progress, url, error };
}

export default useStorage;