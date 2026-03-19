import { useEffect, useState, useCallback } from "react"
import {
  collection, query, orderBy, onSnapshot,
  updateDoc, deleteDoc, doc, addDoc,
  serverTimestamp, writeBatch, getDoc,
} from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
import { useTeam, type MemberRole } from "./Useteam"


export type NotificationType =
  | "board_invite"
  | "board_change"
  | "board_comment"
  | "system"

export interface Notification {
  id:               string
  type:             NotificationType
  title:            string
  body:             string
  read:             boolean
  createdAt:        number
  boardId?:         string
  boardOwnerId?:    string
  boardName?:       string
  invitedBy?:       string
  boardColor?:      string
  role?:            MemberRole
}

export interface AcceptResult {
  ownerUsername: string   
  boardSlug:     string   
  ownerUid:      string
}


export const useNotifications = (uid: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading]             = useState(true)

  const { acceptInvite } = useTeam(undefined, undefined)

  useEffect(() => {
    if (!uid) { setLoading(false); return }
    const q = query(
      collection(db, "users", uid, "notifications"),
      orderBy("createdAt", "desc"),
    )
    const unsub = onSnapshot(q, snap => {
      setNotifications(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
        } as Notification))
      )
      setLoading(false)
    })
    return () => unsub()
  }, [uid])

  const markRead = useCallback(async (id: string) => {
    if (!uid) return
    await updateDoc(doc(db, "users", uid, "notifications", id), { read: true })
  }, [uid])

  const markAllRead = useCallback(async () => {
    if (!uid) return
    const batch = writeBatch(db)
    notifications
      .filter(n => !n.read)
      .forEach(n => batch.update(
        doc(db, "users", uid, "notifications", n.id),
        { read: true },
      ))
    await batch.commit()
  }, [uid, notifications])

  const dismiss = useCallback(async (id: string) => {
    if (!uid) return
    await deleteDoc(doc(db, "users", uid, "notifications", id))
  }, [uid])


  const acceptBoardInvite = useCallback(async (
    notif: Notification,
  ): Promise<AcceptResult | null> => {
    if (!uid || !notif.boardId || !notif.boardOwnerId) return null

    await acceptInvite(
      notif.boardOwnerId,
      notif.boardId,
      uid,
      notif.role ?? "editor",
    )

    let ownerUsername = notif.boardOwnerId 
    try {
      const ownerSnap = await getDoc(doc(db, "users", notif.boardOwnerId))
      if (ownerSnap.exists()) {
        const d = ownerSnap.data()
        ownerUsername = d.username ?? d.displayName ?? notif.boardOwnerId
      }
    } catch {  }

    let boardSlug = notif.boardId 
    try {
      const boardSnap = await getDoc(
        doc(db, "users", notif.boardOwnerId, "boards", notif.boardId)
      )
      if (boardSnap.exists()) {
        boardSlug = boardSnap.data().slug ?? notif.boardId
      }
    } catch {  }

    await dismiss(notif.id)

    return {
      ownerUsername,
      boardSlug,
      ownerUid: notif.boardOwnerId,
    }
  }, [uid, acceptInvite, dismiss])

  const declineInvite = useCallback(async (notif: Notification) => {
    await dismiss(notif.id)
  }, [dismiss])

  const _seedTest = useCallback(async () => {
    if (!uid) return
    await addDoc(collection(db, "users", uid, "notifications"), {
      type:         "board_invite",
      title:        "Board invitation",
      body:         "Du er inviteret til at deltage i 'Design System'",
      read:         false,
      boardId:      "test-board-id",
      boardOwnerId: "test-owner-uid",
      boardName:    "Design System",
      invitedBy:    "Alex",
      boardColor:   "#f97316",
      role:         "editor",
      createdAt:    serverTimestamp(),
    })
  }, [uid])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    loading,
    unreadCount,
    markRead,
    markAllRead,
    dismiss,
    acceptInvite: acceptBoardInvite,
    declineInvite,
    _seedTest,
  }
}