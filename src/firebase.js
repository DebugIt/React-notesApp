// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage, ref} from 'firebase/storage'
import { getDatabase } from "firebase/database";
import 'firebase/storage'
// import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { useState, useEffect } from "react";

const firebaseConfig = {
//   USE YOUR OWN CONFIGS / CREDS
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage1 = getStorage(app);
export const storage = getStorage(app,"gs://dynamic-todo-74809.appspot.com")
// const storageRef = ref(storage, 'images');


// img configs
export const imageConfig = {
  quality: 0.2,
  maxWidth: 800,
  maxHeight: 600,
  autoRotate: true
}



export const db = getDatabase(app);
export const auth = getAuth();

export function logout(){
    return signOut(auth);
}



export function useAuth(){
    const [currentUser, setCurrentUser] = useState();
    useEffect(() => {
      const unsign = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      })
    }, []);
    return currentUser;
    
}


export const goog = new GoogleAuthProvider();
export const signGoog = () => {
    signInWithPopup(auth, goog).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    })
}

