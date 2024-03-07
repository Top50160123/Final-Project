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
  where,
  query,
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
  const userDataWithUID = {
    email: data.email,
    lastName: data.lastName,
    name: data.name,
    studentId: data.studentId,
  };
  await addDoc(collection(db, "usersCMU"), userDataWithUID);
}

async function saveUserCMU(data) {
  const userQuery = query(
    collection(db, "usersCMU"),
    where("email", "==", data.email)
  );
  const querySnapshot = await getDocs(userQuery);

  if (querySnapshot.empty) {
    const userDataWithUID = data;
    await addDoc(collection(db, "CMULogin"), userDataWithUID);
    console.log("User data saved successfully!");
  } else {
    console.log("User data already exists.");
  }
}

async function getUserCMU() {
  try {
    const querySnapshot = await getDocs(collection(db, "usersCMU"));
    const userData = [];
    querySnapshot.forEach((doc) => {
      userData.push({ id: doc.id, ...doc.data() });
    });
    return userData;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
}

// deleteUserByEmail CMU
async function deleteUserByEmail(email) {
  console.log("email:", email);
  // try {
  //   const querySnapshot = await getDocs(
  //     query(collection(db, "usersCMU"), where("email", "==", email))
  //   );
  //   const batch = writeBatch(db);

  //   querySnapshot.forEach((doc) => {
  //     batch.delete(doc.ref);
  //   });

  //   await batch.commit();
  //   console.log("Documents with email", email, "successfully deleted.");
  // } catch (error) {
  //   console.error("Error deleting documents: ", error);
  // }
}

// Audit Log
async function addAction(admin, action, fileName, Url) {
  const pdfData = {
    admin: admin,
    action: action,
    fileName: fileName,
    url: Url,
    timestamp: serverTimestamp(),
  };
  await addDoc(collection(db, "audit_log"), pdfData);
}

// Add to auditLogaddAction
async function createPdf(fileName, Url, user) {
  const AddAction = {
    fileName: fileName,
    url: Url,
    user: user,
    timestamp: serverTimestamp(),
  };
  await addDoc(collection(db, "create"), AddAction);
}

async function deleteRelatedDocumentsByUrl(url) {
  const querySnapshot = await getDocs(collection(db, "create"));
  const batch = writeBatch(db);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.url === url) {
      batch.delete(doc.ref);
    }
  });

  // Execute the batch operation
  await batch.commit();
}

async function deleteDocumentsByUrl(url) {
  const signCollectionRef = collection(db, "sign");
  const querySnapshot = await query(
    signCollectionRef,
    where("files.Url", "==", url)
  ).get();

  querySnapshot.forEach(async (doc) => {
    try {
      await deleteDoc(doc.ref);
      console.log("Document deleted successfully:", doc.id);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  });
}

// get create doc
async function getCreatedDocuments() {
  const querySnapshot = await getDocs(collection(db, "create"));
  const getCreate = [];
  querySnapshot.forEach((doc) => {
    getCreate.push({ id: doc.id, data: doc.data() });
  });
  return getCreate;
}

// get audit
async function getDocuments() {
  const querySnapshot = await getDocs(collection(db, "audit_log"));
  const auditLogs = [];
  querySnapshot.forEach((doc) => {
    auditLogs.push({ id: doc.id, data: doc.data() });
  });
  return auditLogs;
}

// want to sign Doc
async function SignDoc(email, type, Url) {
  const signCollectionRef = collection(db, "sign");
  const userSignDocRef = doc(signCollectionRef, email);

  const docSnapshot = await getDoc(userSignDocRef);
  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    const newFileName = `fileName${Object.keys(data.files).length + 1}`;
    const newData = {
      ...data,
      files: {
        ...data.files,
        [newFileName]: { type, Url, timestamp: serverTimestamp() },
      },
    };
    await setDoc(userSignDocRef, newData);

    return newData;
  } else {
    const signDoc = {
      files: {
        fileName1: { type, Url, timestamp: serverTimestamp() },
      },
    };
    await setDoc(userSignDocRef, signDoc);
    return signDoc;
  }
}

async function getSignedDocument() {
  const signCollectionRef = collection(db, "sign");
  const snapshot = await getDocs(signCollectionRef);

  const allUserData = [];
  snapshot.forEach((doc) => {
    const userData = doc.data();
    allUserData.push({ email: doc.id, files: userData.files });
  });

  return allUserData;
}

async function UrlSign(user, fileName, date, url, action) {
  const signCollectionRef = collection(db, "signUrl");
  const userSignDocRef = doc(signCollectionRef, user);

  const docSnapshot = await getDoc(userSignDocRef);
  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    const existingFile = Object.entries(data.files).find(([key, value]) => value.fileName === fileName);

    if (existingFile) {
      const existingFileName = existingFile[0];
      const updatedFiles = {
        ...data.files,
        [existingFileName]: { fileName, url, date, action },
      };
      const newData = {
        ...data,
        files: updatedFiles,
      };
      await setDoc(userSignDocRef, newData);
      return newData;
    } else {
      // Add a new file
      const newFileName = `fileName${Object.keys(data.files).length + 1}`;
      const newData = {
        ...data,
        files: {
          ...data.files,
          [newFileName]: { fileName, url, date, action },
        },
      };
      await setDoc(userSignDocRef, newData);
      return newData;
    }
  } else {
    const signDoc = {
      files: {
        fileName1: { fileName, url, date, action },
      },
    };
    await setDoc(userSignDocRef, signDoc);
    return signDoc;
  }
}


// async function UrlSign(user, fileName, date, url, action) {
//   const signCollectionRef = collection(db, "signUrl");
//   const userSignDocRef = doc(signCollectionRef, user);

//   const docSnapshot = await getDoc(userSignDocRef);
//   if (docSnapshot.exists()) {
//     const data = docSnapshot.data();
//     const newFileName = `fileName${Object.keys(data.files).length + 1}`;
//     const newData = {
//       ...data,
//       files: {
//         ...data.files,
//         [newFileName]: { fileName, url, date, action },
//       },
//     };
//     await setDoc(userSignDocRef, newData);

//     return newData;
//   } else {
//     const signDoc = {
//       files: {
//         fileName1: { fileName, url, date, action },
//       },
//     };
//     await setDoc(userSignDocRef, signDoc);
//     return signDoc;
//   }
// }

async function getUrl(user) {
  const signCollectionRef = collection(db, "signUrl");
  const userSignDocRef = doc(signCollectionRef, user);

  const docSnapshot = await getDoc(userSignDocRef);
  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    return data;
  } else {
    console.log("Document does not exist");
    return null;
  }
}

const getAllSignData = async () => {
  const signCollectionRef = collection(db, "signUrl");
  const querySnapshot = await getDocs(signCollectionRef);

  const allSignData = [];
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    const files = userData.files;

    const userSignInfo = Object.values(files).map((file) => ({
      user: doc.id,
      action: file.action,
      date: file.date,
    }));

    allSignData.push(...userSignInfo);
  });

  return allSignData;
};

export {
  updateUser,
  getUserCMU,
  saveUserCMU,
  checkAdmin,
  userCMU,
  createPdf,
  deleteRelatedDocumentsByUrl,
  deleteDocumentsByUrl,
  getDocuments,
  addAction,
  getCreatedDocuments,
  SignDoc,
  getSignedDocument,
  UrlSign,
  getUrl,
  getAllSignData,
  deleteUserByEmail,
};
export default app;
