import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWP2-q5-TK0Q8RKbSVDTMPQ2ZWwqw_pvo",
  authDomain: "undo2-33313.firebaseapp.com",
  databaseURL: "https://undo2-33313-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "undo2-33313",
  storageBucket: "undo2-33313.appspot.com",
  messagingSenderId: "460551200971",
  appId: "1:460551200971:web:48f4a5fe881ca235bbbb4e",
  measurementId: "G-R58866WHM3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);