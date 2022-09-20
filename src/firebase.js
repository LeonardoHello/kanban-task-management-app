import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, collection, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsniN5axlF_-QmYPRe4gUl5MnQwI3khdc",
  authDomain: "kanban-task-management-app.firebaseapp.com",
  projectId: "kanban-task-management-app",
  storageBucket: "kanban-task-management-app.appspot.com",
  messagingSenderId: "1031756304969",
  appId: "1:1031756304969:web:84e3aca370c4324fb02598"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db, collection, onSnapshot }