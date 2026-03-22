import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
import MaintenancePage from "./MaintenancePage"

const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "config", "siteStatus"), snap => {
      setOnline(snap.exists() ? (snap.data().online ?? true) : true)
    })
    return () => unsub()
  }, [])

  if (online === null) return (
    <div className="min-h-screen bg-[#1e2433] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!online) return <MaintenancePage />

  return <>{children}</>
}

export default MaintenanceGuard