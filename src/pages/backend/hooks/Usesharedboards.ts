import { useEffect, useState } from "react"
import {
     collectionGroup, query, where,
  onSnapshot, getDoc, doc,
} from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"

export interface SharedBoard {
  boardId:    string
  ownerUid:   string
  title:      string
  color:      string
  iconName:   string
  slug:       string
  role:       "editor" | "viewer"
  ownerName?: string
}

export const useSharedBoards = (uid: string | undefined) => {
  const [sharedBoards, setSharedBoards] = useState<SharedBoard[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    if (!uid) { setLoading(false); return }

    const membersQuery = query(
      collectionGroup(db, "members"),
      where("uid", "==", uid),
    )

    const unsub = onSnapshot(membersQuery, async snap => {
      const results = await Promise.all(snap.docs.map(async memberDoc => {
        try {
          const pathParts = memberDoc.ref.path.split("/")
          const ownerUid = pathParts[1]
          const boardId  = pathParts[3]

          if (ownerUid === uid) return null

          const boardSnap = await getDoc(doc(db, "users", ownerUid, "boards", boardId))
          if (!boardSnap.exists()) return null

          const board = boardSnap.data()

          let ownerName = "Unknown"
          try {
            const ownerSnap = await getDoc(doc(db, "users", ownerUid))
            if (ownerSnap.exists()) {
              const o = ownerSnap.data()
              ownerName = o.username ?? o.displayName ?? ownerUid.slice(0, 8)
            }
          } catch { }

          return {
            boardId,
            ownerUid,
            title:     board.title    ?? "Untitled",
            color:     board.color    ?? "#f97316",
            iconName:  board.iconName ?? "AlignLeft",
            slug:      board.slug     ?? boardId,
            role:      memberDoc.data().role ?? "viewer",
            ownerName,
          } as SharedBoard
        } catch {
          return null
        }
      }))

      setSharedBoards(results.filter(Boolean) as SharedBoard[])
      setLoading(false)
    })

    return () => unsub()
  }, [uid])

  return { sharedBoards, loading }
}