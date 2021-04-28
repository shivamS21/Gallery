import { useState, useEffect } from 'react';
import { projectStorage, projectFirestore, timestamp } from '../firebase/config';
import { useSelector } from "react-redux";
import{ selectUserData } from "../features/userSlice";

const useStorage = (file) => {
  const emailID = useSelector(selectUserData)?.email;
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  let message=""
    const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {resolve(reader.result)});
    // reader.readAsDataURL(e.target.files[0]);
    reader.readAsDataURL(file);
    
    // reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

  useEffect(() => {
    (async ()=>{
      const storageRef = projectStorage.ref(file.name);
      const collectionRef = projectFirestore.collection('images');
       message=await toBase64(file)
      // console.log(message)
      // await collectionRef.putString(message, 'base64url').then(function(snapshot) {
      //    console.log('Uploaded a base64url string!');
      //    console.log(snapshot)
      //  })
      storageRef.putString(message, 'data_url').on('state_changed', (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      }, (err) => {
        setError(err);
      }, async () => {
       
        const url = await storageRef.getDownloadURL();
        const createdAt = timestamp();
        await collectionRef.add({ email: emailID, url, createdAt,string:message });
      //  console.log(url)
        setUrl(url);
      });
    })()
    // references
  
  }, [message, emailID]);

  return { progress, url, error };
}

export default useStorage;