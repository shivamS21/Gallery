import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBhDCrPgM_PJVgL9EjQXyVVGbvI6zWST0M",
  authDomain: "codegym1-9e70f.firebaseapp.com",
  projectId: "codegym1-9e70f",
  storageBucket: "codegym1-9e70f.appspot.com",
  messagingSenderId: "553051392183",
  appId: "1:553051392183:web:d75bbb08928042463f2532"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const auth  = firebase.auth();
export { projectStorage, projectFirestore, timestamp, auth };