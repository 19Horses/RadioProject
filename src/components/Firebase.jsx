import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0CkEQk6MEe6sJGihsmxkQhcoHLsLiHzg",
  authDomain: "rp-chat-log.firebaseapp.com",
  projectId: "rp-chat-log",
  storageBucket: "rp-chat-log.firebasestorage.app",
  messagingSenderId: "400175216764",
  appId: "1:400175216764:web:0cea1ba52b6a19e83131f9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
