import { useEffect, useState, useCallback } from "react"
import {
  collection, doc, onSnapshot, setDoc, deleteDoc,
  getDocs, query, where, addDoc, serverTimestamp, getDoc,
} from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"

export type MemberRole = "owner" | "editor" | "viewer"

export interface BoardMember {
  uid:          string
  role:         MemberRole
  joinedAt:     number
  displayName?: string
  username?:    string
  avatarUrl?:   string
}


export const fetchUserProfile = async (uid: string): Promise<{
  displayName?: string
  username?:    string
  avatarUrl?:   string
}> => {
  try {
    const userSnap = await getDoc(doc(db, "users", uid))
    if (userSnap.exists()) {
      const d = userSnap.data()
      if (d.displayName || d.username || d.avatarUrl) {
        return {
          displayName: d.displayName ?? d.username ?? undefined,
          username:    d.username    ?? undefined,
          avatarUrl:   d.avatarUrl   ?? d.photoURL ?? undefined,
        }
      }
    }

    const profileSnap = await getDoc(doc(db, "users", uid, "profile", "data"))
    if (profileSnap.exists()) {
      const d = profileSnap.data()
      return {
        displayName: d.displayName ?? d.username ?? undefined,
        username:    d.username    ?? undefined,
        avatarUrl:   d.avatarUrl   ?? d.photoURL ?? undefined,
      }
    }

    return { displayName: uid.slice(0, 8), username: uid.slice(0, 8) }
  } catch {
    return { displayName: uid.slice(0, 8), username: uid.slice(0, 8) }
  }
}


export const useTeam = (
  ownerUid: string | undefined,
  boardId:  string | undefined,
) => {
  const [members, setMembers] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ownerUid || !boardId) { setLoading(false); return }

    const colRef = collection(db, "users", ownerUid, "boards", boardId, "members")
    const unsub  = onSnapshot(colRef, async snap => {
      const raw = snap.docs.map(d => ({
        uid:      d.id,
        role:     d.data().role as MemberRole,
        joinedAt: d.data().joinedAt?.toMillis?.() ?? Date.now(),
      }))

      const enriched = await Promise.all(raw.map(async m => {
        const profile = await fetchUserProfile(m.uid)
        return { ...m, ...profile } as BoardMember
      }))

      setMembers(enriched)
      setLoading(false)
    })

    return () => unsub()
  }, [ownerUid, boardId])


  const inviteByUsername = useCallback(async (
    inviterName:    string,
    boardTitle:     string,
    boardColor:     string,
    targetUsername: string,
    role: MemberRole = "editor",
  ): Promise<{ ok: boolean; error: string | null }> => {
    if (!ownerUid || !boardId) return { ok: false, error: "Missing board" }

    const clean = targetUsername.toLowerCase().replace(/^@/, "").trim()
    if (!clean) return { ok: false, error: "Ugyldigt brugernavn" }

    const usersQuery = query(
      collection(db, "users"),
      where("username", "==", clean),
    )
    const snap = await getDocs(usersQuery)

    if (snap.empty) {
      return { ok: false, error: `Ingen bruger fundet med @${clean}` }
    }

    const targetUid = snap.docs[0].id

    if (targetUid === ownerUid) {
      return { ok: false, error: "Du kan ikke invitere dig selv" }
    }

    const memberRef = doc(db, "users", ownerUid, "boards", boardId, "members", targetUid)
    if ((await getDoc(memberRef)).exists()) {
      return { ok: false, error: "Brugeren er allerede medlem" }
    }

    const targetProfile = await fetchUserProfile(targetUid)
    const targetName    = targetProfile.displayName ?? clean

    await addDoc(collection(db, "users", targetUid, "notifications"), {
      type:         "board_invite",
      title:        "Board invitation",
      body:         `${inviterName} har inviteret dig til "${boardTitle}"`,
      read:         false,
      boardId,
      boardOwnerId: ownerUid,
      boardName:    boardTitle,
      boardColor,
      invitedBy:    inviterName,
      inviteeName:  targetName,
      role,
      createdAt:    serverTimestamp(),
    })

    return { ok: true, error: null }
  }, [ownerUid, boardId])


  const acceptInvite = useCallback(async (
    boardOwnerId:  string,
    targetBoardId: string,
    newMemberUid:  string,
    role: MemberRole = "editor",
  ) => {
    await setDoc(
      doc(db, "users", boardOwnerId, "boards", targetBoardId, "members", newMemberUid),
      { role, uid: newMemberUid, joinedAt: serverTimestamp() },
    )
  }, [])


  const removeMember = useCallback(async (memberUid: string) => {
    if (!ownerUid || !boardId) return
    await deleteDoc(doc(db, "users", ownerUid, "boards", boardId, "members", memberUid))
  }, [ownerUid, boardId])


  const changeRole = useCallback(async (memberUid: string, role: MemberRole) => {
    if (!ownerUid || !boardId) return
    await setDoc(
      doc(db, "users", ownerUid, "boards", boardId, "members", memberUid),
      { role },
      { merge: true },
    )
  }, [ownerUid, boardId])

  return { members, loading, inviteByUsername, acceptInvite, removeMember, changeRole }
}