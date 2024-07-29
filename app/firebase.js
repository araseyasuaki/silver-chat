import { initializeApp } from "firebase/app";
import { getAuth } from '@firebase/auth';
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMpmTk0LiQ7R6dlkD9TAWtYB9WtDGajIo",
  authDomain: "chat-app-ff7e9.firebaseapp.com",
  projectId: "chat-app-ff7e9",
  storageBucket: "chat-app-ff7e9.appspot.com",
  messagingSenderId: "102410004892",
  appId: "1:102410004892:web:71c85d9dab6e5c8a5e0059"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };