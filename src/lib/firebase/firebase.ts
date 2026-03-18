import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCNQDnINd6qTBM9Qsnsq5YxM20T9QrT8fo",
  authDomain: "buildernoter.firebaseapp.com",
  projectId: "buildernoter",
  storageBucket: "buildernoter.firebasestorage.app",
  messagingSenderId: "846900573089",
  appId: "1:846900573089:web:d7a3c5e3a7c90cdfc9d1e0",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app) 