// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword,onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4t_FRgFG4aENNopVdl8ipqINwSz4G0FQ",
  authDomain: "custom-cms-5581b.firebaseapp.com",
  projectId: "custom-cms-5581b",
  storageBucket: "custom-cms-5581b.firebasestorage.app",
  messagingSenderId: "1007647940489",
  appId: "1:1007647940489:web:7f5e1bcba5c223d4a0cb58",
  measurementId: "G-Q35QCPJ1XG"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);



export { database, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,onAuthStateChanged };
