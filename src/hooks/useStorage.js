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
  // console.log('check1',file);
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
    let url="", base64Image="";
    storageRef.put(file).on('state_changed', (snap) => {
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      setProgress(percentage);
    }, (err) => {
      setError(err);
    }, async () => {
       url = await storageRef.getDownloadURL();
       base64Image = await Main(file);
      // , base64str:"data:image/png;base64,"+ base64Image
      // console.log('shiva',base64Image);
      const createdAt = timestamp();
      await collectionRef.add({ email: emailID, url, createdAt, docUrl: 'shivam' });
      setUrl(url);
    });
    storageRef.putString(base64Image, 'base64', {contentType:'image/jpg'});
    // storageRef.putString(base64Image, 'base64').then(function(snapshot) {
    //   console.log('Uploaded a base64 string!');
    // });
  }, [file, emailID]);

  return { progress, url, error };
}

export default useStorage;