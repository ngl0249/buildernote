import { useEffect, useState } from "react"
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, setDoc,
  serverTimestamp, writeBatch,
} from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
import { type Board } from "../types/index"
import { DEFAULT_ICON, DEFAULT_COLOR } from "../hooks/BoardIcons"

export interface DeletedBoard {
  id:        string
  title:     string
  slug:      string
  iconName:  string
  color:     string
  cardCount: number
  order:     number
  deletedAt: number
}

const toSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)

export const useBoards = (uid: string | undefined) => {
  const [boards, setBoards]               = useState<Board[]>([])
  const [deletedBoards, setDeletedBoards] = useState<DeletedBoard[]>([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    if (!uid) { setLoading(false); return }
    const q     = query(collection(db, "users", uid, "boards"), orderBy("order", "asc"))
    const unsub = onSnapshot(q, snap => {
      setBoards(snap.docs.map(d => ({ id: d.id, ...d.data() } as Board)))
      setLoading(false)
    })
    return () => unsub()
  }, [uid])

  useEffect(() => {
    if (!uid) return
    const q     = query(
      collection(db, "users", uid, "deletedBoards"),
      orderBy("deletedAt", "desc"),
    )
    const unsub = onSnapshot(q, snap => {
      setDeletedBoards(snap.docs.map(d => ({ id: d.id, ...d.data() } as DeletedBoard))
      )
    })
    return () => unsub()
  }, [uid])

  const createBoard = async (title: string, iconName: string, color: string) => {
    if (!uid) return
    await addDoc(collection(db, "users", uid, "boards"), {
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
    const board = boards.find(b => b.id === id)
    if (!board) return

    await setDoc(doc(db, "users", uid, "deletedBoards", id), {
      title:     board.title,
      slug:      board.slug      ?? toSlug(board.title),
      iconName:  board.iconName  ?? DEFAULT_ICON.name,
      color:     board.color     ?? DEFAULT_COLOR,
      cardCount: board.cardCount ?? 0,
      order:     board.order     ?? 0,
      deletedAt: Date.now(),
    })

    await deleteDoc(doc(db, "users", uid, "boards", id))
  }

  const restoreBoard = async (id: string) => {
    if (!uid) return
    const board = deletedBoards.find(b => b.id === id)
    if (!board) return

    await setDoc(doc(db, "users", uid, "boards", id), {
      title:     board.title,
      slug:      board.slug,
      iconName:  board.iconName,
      color:     board.color,
      cardCount: board.cardCount,
      order:     boards.length,   
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    await deleteDoc(doc(db, "users", uid, "deletedBoards", id))
  }

  const deleteForever = async (id: string) => {
    if (!uid) return
    await deleteDoc(doc(db, "users", uid, "deletedBoards", id))
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

  return {
    boards,
    deletedBoards,
    loading,
    createBoard,
    renameBoard,
    updateBoardStyle,
    deleteBoard,
    restoreBoard,
    deleteForever,
    reorderBoards,
  }
}