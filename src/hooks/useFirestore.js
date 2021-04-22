import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';
import { useSelector } from "react-redux";
import{ selectUserData } from "../features/userSlice";

const useFirestore = (collection) => {
  const [docs, setDocs] = useState([]);
  const emailID = useSelector(selectUserData)?.email;
  useEffect(() => {
    const unsub = projectFirestore.collection(collection)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        let documents = [];
        snap.forEach(doc => {
          if(doc.data().email === emailID){
            documents.push({...doc.data(), id: doc.id});
          }
        });
        setDocs(documents);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [collection, emailID]);

  return { docs };
}

export default useFirestore;