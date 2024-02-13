// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
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

async function updateUser(data, uid) {
  const userDataWithUID = { ...data, uid };
  await addDoc(collection(db, "users"), userDataWithUID);
}

async function checkAdmin(data, uid) {
  const adminDataWithUID = { ...data, uid };
  await addDoc(collection(db, "admin"), adminDataWithUID);
}

async function userCMU(data) {
  try {
    const oldUID = data.uid; 
    const userDataWithUID = { ...data, uid: oldUID }; 
    await addDoc(collection(db, "usersCMU"), userDataWithUID);
  } catch (error) {
    console.error("Error adding user data to Firestore:", error);
  }
}

async function getUserCMU(newUID) {
  try {
    const querySnapshot = await getDocs(collection(db, "usersCMU"));
    const userData = [];
    querySnapshot.forEach((doc) => {
      const uid = doc.data().uid;
      if (uid !== newUID) {
        userData.push({ id: doc.id, ...doc.data() });
      }
    });
    return userData;
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error);
    return [];
  }
}


// Admin create PDF
async function addAction(admin, uid, action, type, fileName, content, Url) {
  const pdfData = {
    admin: admin,
    uid: uid,
    action: action,
    type: type,
    fileName: fileName,
    content: content,
    url: Url,
    timestamp: serverTimestamp(),
  };

  const userDocumentsCollection = collection(
    db,
    "auditLog",
    auth.currentUser.uid,
    "documents"
  );

  try {
    const docRef = await addDoc(userDocumentsCollection, pdfData);
    console.log("Document added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

// Add to auditLogaddAction
async function createPdf(action, type, fileName, content, Url) {
  const AddAction = {
    action: action,
    type: type,
    fileName: fileName,
    content: content,
    url: Url,
    timestamp: serverTimestamp(),
  };
  await addDoc(collection(db, "create"), AddAction);
}

// get audit
async function getDocuments(uid) {
  try {
    const userDocumentsCollection = collection(
      db,
      "auditLog",
      uid,
      "documents"
    );
    const querySnapshot = await getDocs(userDocumentsCollection);
    const documents = [];
    querySnapshot.forEach((doc) => {
      const documentData = doc.data();
      documents.push({
        id: doc.id,
        ...documentData,
      });
    });

    return documents;
  } catch (error) {
    ป;
    console.error("Error getting documents: ", error);
    throw error;
  }
}

async function getCreatedDocuments() {
  try {
    const createCollection = collection(db, "create");
    const querySnapshot = await getDocs(createCollection);
    const documents = [];

    querySnapshot.forEach((doc) => {
      const documentData = doc.data();
      documents.push({
        id: doc.id,
        ...documentData,
      });
    });

    return documents;
  } catch (error) {
    console.error("Error getting created documents: ", error);
    throw error;
  }
}

// want to sign Doc
async function SignDoc(email, uid, type, fileName, content, Url) {
  const signDoc = {
    email: email ,
    uid: uid,
    type: type,
    fileName: fileName,
    content: content,
    url: Url,
    timestamp: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "sign"), signDoc);
  const signedDocument = await getDoc(docRef);
  return signedDocument.data();
}

async function getSignedDocument() {
  try {
    const createCollection = collection(db, "sign");
    const querySnapshot = await getDocs(createCollection);
    const documents = [];

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const documentData = doc.data();
        documents.push({
          id: doc.id,
          ...documentData,
        });
      });
    }

    return documents;
  } catch (error) {
    console.error("Error getting signed document:", error);
    throw error;
  }
}

async function UrlSign(uid, fileName, Url) {
  const urlSign = {
    fileName: fileName,
    url: Url,
  };
  const userDocRef = doc(db, "signUrl", uid);
  await setDoc(userDocRef, urlSign);
}

async function getUrl(uid) {
  const userDocRef = doc(db, "signUrl", uid);

  try {
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const urlData = docSnapshot.data();
      const latestUrl = urlData.url;
      const FileName = urlData.fileName;

      console.log(`Latest URL for UID ${uid}: ${latestUrl}`);
      console.log(`Latest URL for FileName ${uid}: ${FileName}`);

      return { latestUrl, FileName };
    } else {
      console.log(`No document found for UID ${uid}`);
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

async function deleteUrl(uid) {
  const userDocRef = doc(db, "signUrl", uid);

  try {
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      await deleteDoc(userDocRef);
      console.log(`Document deleted for UID ${uid}`);
    } else {
      console.log(`No document found for UID ${uid}`);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

export {
  updateUser,
  getUserCMU,
  checkAdmin,
  userCMU,
  createPdf,
  getDocuments,
  addAction,
  getCreatedDocuments,
  SignDoc,
  getSignedDocument,
  UrlSign,
  getUrl,
  deleteUrl,
};
export default app;
