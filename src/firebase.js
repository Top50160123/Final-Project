// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1fSFNTLY8TKDS1c2cLs8umehdEl3n7VY",
  authDomain: "final-auth-project.firebaseapp.com",
  projectId: "final-auth-project",
  storageBucket: "final-auth-project.appspot.com",
  messagingSenderId: "934602128682",
  appId: "1:934602128682:web:cc45f4e7bafa4db795b253",
  measurementId: "G-FLXSK23R9P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

async function updateUser(data) {
  await addDoc(collection(db, "users"), data);
}

export { updateUser };
export default app;
