import { useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../../../lib/firebase/firebase"
import { type UserProfile, type Role } from "../types/index"

interface UseAuthReturn {
  user:    User | null
  profile: UserProfile | null
  role:    Role | null
  loading: boolean
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser]       = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        const ref  = doc(db, "users", firebaseUser.uid)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          setProfile(snap.data() as UserProfile)
        } else {
          const newProfile: UserProfile = {
            uid:         firebaseUser.uid,
            displayName: firebaseUser.displayName ?? "Builder",
            username:    firebaseUser.uid.slice(0, 8), 
            email:       firebaseUser.email ?? "",
            avatarUrl:   firebaseUser.photoURL ?? "",
            role:        "Default",                     
            createdAt:   Date.now(),
          }
          await setDoc(ref, { ...newProfile, createdAt: serverTimestamp() })
          setProfile(newProfile)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsub()
  }, [])

  return { user, profile, role: profile?.role ?? null, loading }
}