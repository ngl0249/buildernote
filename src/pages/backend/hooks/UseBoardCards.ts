import { useEffect, useState } from "react"
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc,
  serverTimestamp, increment,
} from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
import { type BoardCard, type CardType } from "../types/index"

export const useBoardCards = (uid: string | undefined, boardId: string | undefined) => {
  const [cards, setCards]     = useState<BoardCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid || !boardId) { setLoading(false); return }

    const colRef = collection(db, "users", uid, "boards", boardId, "cards")
    const q      = query(colRef, orderBy("order", "asc"))

    const unsub = onSnapshot(q, snap => {
      setCards(snap.docs.map(d => ({ id: d.id, ...d.data() } as BoardCard)))
      setLoading(false)
    })

    return () => unsub()
  }, [uid, boardId])
  const boardRef = (uid: string, boardId: string) =>
    doc(db, "users", uid, "boards", boardId)

  const addCard = async (type: CardType, x = 40, y = 40) => {
    if (!uid || !boardId) return
    const colRef = collection(db, "users", uid, "boards", boardId, "cards")

    const defaults: Record<CardType, Partial<BoardCard>> = {
      note:    { content: "", width: 280 },
      heading: { content: "New heading", width: 320 },
      todo:    { content: "New task", checked: [false], width: 280 },
      link:    { content: "", title: "Link", width: 280 },
    }

    await addDoc(colRef, {
      type,
      x,
      y,
      order:     cards.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...defaults[type],
    })

    await updateDoc(boardRef(uid, boardId), {
      cardCount: increment(1),
    })
  }

  const updateCard = async (id: string, data: Partial<BoardCard>) => {
    if (!uid || !boardId) return
    await updateDoc(doc(db, "users", uid, "boards", boardId, "cards", id), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }

  const moveCard = async (id: string, x: number, y: number) => {
    if (!uid || !boardId) return
    await updateDoc(doc(db, "users", uid, "boards", boardId, "cards", id), { x, y })
  }

  const deleteCard = async (id: string) => {
    if (!uid || !boardId) return
    await deleteDoc(doc(db, "users", uid, "boards", boardId, "cards", id))

    await updateDoc(boardRef(uid, boardId), {
      cardCount: increment(-1),
    })
  }

  return { cards, loading, addCard, updateCard, moveCard, deleteCard }
}