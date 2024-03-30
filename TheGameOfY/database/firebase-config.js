import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from '@firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getPerformance } from "firebase/performance";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDmftelLosbl-4-KaGzu7XmLI0ShPpsTf4",
  authDomain: "thegameofy-882c6.firebaseapp.com",
  databaseURL: "https://thegameofy-882c6-default-rtdb.firebaseio.com",
  projectId: "thegameofy-882c6",
  storageBucket: "thegameofy-882c6.appspot.com",
  messagingSenderId: "86555494795",
  appId: "1:86555494795:web:0a4ae73d2a7baedac6078e"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
export const db = getDatabase(app);
export const authentication = getAuth(app);
// const perf = getPerformance(app);