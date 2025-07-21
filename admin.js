// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  getAuth, signInWithPopup, GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyC-oOeizCyczwOoHGugKb9hGwA7M_Y4l4M",
  authDomain: "nex-ai-96716.firebaseapp.com",
  projectId: "nex-ai-96716",
  storageBucket: "nex-ai-96716.appspot.com",
  messagingSenderId: "987812125046",
  appId: "1:987812125046:web:2a9535e4f5fbe69c0e4257",
  measurementId: "G-XS8MVYWSNQ"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Akaun yang dibenarkan akses
const allowedAdmins = ["nexai.official.anasnidir@gmail.com", "anasnide@gmail.com"];

// ===== LOGIN GOOGLE =====
window.adminLogin = function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const email = user.email;

      if (allowedAdmins.includes(email)) {
        document.getElementById("admin-area").classList.remove("hidden");
        loadKeys();
        loadModel();
      } else {
        alert("❌ You are not authorized as admin.");
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("❌ Login failed.");
    });
};

// ===== TAB SWITCHING =====
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(tab).classList.add('active');
  });
});

// ===== API KEY MANAGEMENT =====
const keyList = document.getElementById('key-list');
const newKeyInput = document.getElementById('new-key');

// Papar semua key
async function loadKeys() {
  keyList.innerHTML = '';
  const snapshot = await getDocs(collection(db, "keys"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const keyItem = document.createElement('li');
    keyItem.classList.add('key-item');
    if (data.active) keyItem.classList.add('active');

    keyItem.innerHTML = `
      <div class="key-info">
        🔐 ${data.key}<br>
        FailCount: ${data.failCount || 0}
      </div>
      <div class="key-actions">
        <button onclick="makeActive('${docSnap.id}')">Set Active</button>
        <button onclick="deleteKey('${docSnap.id}')">Delete</button>
      </div>
    `;
    keyList.appendChild(keyItem);
  });
}

// Tambah key baru
window.addKey = async function () {
  const key = newKeyInput.value.trim();
  if (!key) return alert("⚠️ Masukkan key dahulu!");
  await addDoc(collection(db, "keys"), {
    key,
    failCount: 0,
    active: false
  });
  newKeyInput.value = '';
  loadKeys();
}

// Padam key
window.deleteKey = async function (docId) {
  if (confirm("Padam key ini?")) {
    await deleteDoc(doc(db, "keys", docId));
    loadKeys();
  }
}

// Jadikan key aktif
window.makeActive = async function (docId) {
  const snapshot = await getDocs(collection(db, "keys"));
  snapshot.forEach(async docSnap => {
    await updateDoc(doc(db, "keys", docSnap.id), {
      active: docSnap.id === docId
    });
  });
  loadKeys();
}

// Reset semua failCount
window.resetFailCount = async () => {
  const snapshot = await getDocs(collection(db, "keys"));
  for (const docSnap of snapshot.docs) {
    await updateDoc(doc(db, "keys", docSnap.id), { failCount: 0 });
  }
  loadKeys();
  alert("✅ Semua failCount telah direset.");
}

// ===== SET ACTIVE MODEL =====
window.updateModel = async () => {
  const modelInput = document.getElementById("active-model");
  const newModel = modelInput.value.trim();
  if (!newModel) return alert("⚠️ Masukkan nama model.");

  await setDoc(doc(db, "config", "model"), {
    active: newModel
  });

  alert("✅ Model aktif dikemaskini.");
};

// Papar model sekarang (optional)
async function loadModel() {
  const modelRef = doc(db, "config", "model");
  const snapshot = await getDocs(collection(db, "config"));
  snapshot.forEach(docSnap => {
    if (docSnap.id === "model") {
      const data = docSnap.data();
      document.getElementById("active-model").value = data.active || "";
    }
  });
}