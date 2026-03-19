import { useEffect } from "react"
import { doc, setDoc, deleteDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"

export const useOnlinePresence = (uid: string | undefined) => {
  useEffect(() => {
    if (!uid) return
    const ref = doc(db, "onlineUsers", uid)
    setDoc(ref, { uid, updatedAt: Date.now() }, { merge: true })
    const interval = setInterval(() => {
      setDoc(ref, { uid, updatedAt: Date.now() }, { merge: true })
    }, 10_000)
    return () => {
      clearInterval(interval)
      deleteDoc(ref)
    }
  }, [uid])
}