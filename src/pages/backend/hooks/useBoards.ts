import { useEffect, useState } from "react"
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc,
  serverTimestamp, writeBatch,
} from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
import { type Board } from "../types/index"
import { DEFAULT_ICON, DEFAULT_COLOR } from "../hooks/BoardIcons"

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)

export const useBoards = (uid: string | undefined) => {
  const [boards, setBoards]   = useState<Board[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) { setLoading(false); return }
    const colRef = collection(db, "users", uid, "boards")
    const q      = query(colRef, orderBy("order", "asc"))
    const unsub  = onSnapshot(q, snap => {
      setBoards(snap.docs.map(d => ({ id: d.id, ...d.data() } as Board)))
      setLoading(false)
    })
    return () => unsub()
  }, [uid])

  const createBoard = async (title: string, iconName: string, color: string) => {
    if (!uid) return
    const colRef = collection(db, "users", uid, "boards")
    await addDoc(colRef, {
      title,
      slug:      toSlug(title),      
      iconName:  iconName || DEFAULT_ICON.name,
      color:     color    || DEFAULT_COLOR,
      cardCount: 0,
      order:     boards.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  const renameBoard = async (id: string, title: string) => {
    if (!uid) return
    await updateDoc(doc(db, "users", uid, "boards", id), {
      title,
      slug:      toSlug(title),      
      updatedAt: serverTimestamp(),
    })
  }

  const updateBoardStyle = async (id: string, iconName: string, color: string) => {
    if (!uid) return
    await updateDoc(doc(db, "users", uid, "boards", id), {
      iconName,
      color,
      updatedAt: serverTimestamp(),
    })
  }

  const deleteBoard = async (id: string) => {
    if (!uid) return
    await deleteDoc(doc(db, "users", uid, "boards", id))
  }

  const reorderBoards = async (reordered: Board[]) => {
    if (!uid) return
    const batch = writeBatch(db)
    reordered.forEach((board, index) => {
      batch.update(doc(db, "users", uid, "boards", board.id), { order: index })
    })
    await batch.commit()
    setBoards(reordered.map((b, i) => ({ ...b, order: i })))
  }

  return { boards, loading, createBoard, renameBoard, updateBoardStyle, deleteBoard, reorderBoards }
}