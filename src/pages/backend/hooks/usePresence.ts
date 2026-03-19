import { useEffect, useRef, useState } from "react"
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"

export interface PresenceUser {
  uid:            string
  x:              number
  y:              number
  selectedCardId: string | null
  displayName:    string
  avatarUrl:      string
  color:          string
  updatedAt:      number
}

const PRESENCE_COLORS = [
  "#f97316", "#3b82f6", "#8b5cf6", "#10b981",
  "#ef4444", "#f59e0b", "#06b6d4", "#ec4899",
]

export const usePresence = (
  ownerUid:    string | undefined,
  boardId:     string | undefined,
  currentUid:  string | undefined,
  displayName: string,
  avatarUrl:   string,
) => {
  const colorRef = useRef(
    PRESENCE_COLORS[Math.floor(Math.random() * PRESENCE_COLORS.length)]
  )
  const docRef = useRef<ReturnType<typeof doc> | null>(null)

  useEffect(() => {
    if (!ownerUid || !boardId || !currentUid) return
    docRef.current = doc(db, "users", ownerUid, "boards", boardId, "presence", currentUid)
    setDoc(docRef.current, {
      uid: currentUid, displayName, avatarUrl,
      color: colorRef.current, updatedAt: Date.now(),
      x: 0, y: 0, selectedCardId: null,
    }, { merge: true })

    return () => {
      if (docRef.current) deleteDoc(docRef.current)
    }
  }, [ownerUid, boardId, currentUid, displayName, avatarUrl])

  const updatePresence = (data: Partial<{ x: number; y: number; selectedCardId: string | null }>) => {
    if (!docRef.current) return
    setDoc(docRef.current, { ...data, updatedAt: Date.now() }, { merge: true })
  }

  return { updatePresence, myColor: colorRef.current }
}

export const useOthersPresence = (
  ownerUid:   string | undefined,
  boardId:    string | undefined,
  currentUid: string | undefined,
) => {
  const [others, setOthers] = useState<PresenceUser[]>([])

  useEffect(() => {
    if (!ownerUid || !boardId) return
    const ref = collection(db, "users", ownerUid, "boards", boardId, "presence")
    const unsub = onSnapshot(ref, snap => {
      const now = Date.now()
      setOthers(
        snap.docs
          .map(d => d.data() as PresenceUser)
          .filter(p => p.uid !== currentUid && now - p.updatedAt < 30_000)
      )
    })
    return () => unsub()
  }, [ownerUid, boardId, currentUid])

  return others
}