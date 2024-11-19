import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyChqOdIdsQ8WrlSezcBBb2oTI4D0Oe1M3o",
    authDomain: "idkk-f8ebd.firebaseapp.com",
    projectId: "idkk-f8ebd",
    storageBucket: "idkk-f8ebd.firebasestorage.app",
    messagingSenderId: "558186870305",
    appId: "1:558186870305:web:94efc43d5b167d001f1560"
  };
  
// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to initialize or fetch user inventory from Firestore
export async function getUserInventory(userId) {
  const userDoc = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    return userSnapshot.data();
  } else {
    // If no data, create initial inventory
    await setDoc(userDoc, { shields: 1, laserCannons: 1 });
    return { shields: 1, laserCannons: 1 };
  }
}

// Function to upgrade user inventory item
export async function upgradeUserInventory(userId, item) {
  const userDoc = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    userData[item] = (userData[item] || 1) + 1; // Upgrade the item
    await updateDoc(userDoc, { [item]: userData[item] });
    return userData[item];
  } else {
    // Initialize if the user does not exist
    await setDoc(userDoc, { [item]: 2 }); // starting level is 2 after first upgrade
    return 2;
  }
}
