// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ✅ Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC-oOeizCyczwOoHGugKb9hGwA7M_Y4l4M",
  authDomain: "nex-ai-96716.firebaseapp.com",
  projectId: "nex-ai-96716",
  storageBucket: "nex-ai-96716.firebasestorage.app",
  messagingSenderId: "987812125046",
  appId: "1:987812125046:web:2a9535e4f5fbe69c0e4257",
  measurementId: "G-XS8MVYWSNQ"
};

// ✅ Initialize Firebase app & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Export Firestore instance
export { db };