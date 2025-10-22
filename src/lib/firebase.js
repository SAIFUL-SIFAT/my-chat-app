import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-7b11c.firebaseapp.com",
  projectId: "reactchat-7b11c",
  storageBucket: "reactchat-7b11c.firebasestorage.app",
  messagingSenderId: "638244707881",
  appId: "1:638244707881:web:7a24770bf3e3a48c390638"

  
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);