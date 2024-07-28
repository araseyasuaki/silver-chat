import { initializeApp } from "firebase/app";
import { getAuth } from '@firebase/auth';
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdLxdXJ4WM5g-JW7gWQ6kZ3EpRbjpTCXI",
  authDomain: "chat-app-55c59.firebaseapp.com",
  projectId: "chat-app-55c59",
  storageBucket: "chat-app-55c59.appspot.com",
  messagingSenderId: "256547840638",
  appId: "1:256547840638:web:24ec9e424805e9af20ee2f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };