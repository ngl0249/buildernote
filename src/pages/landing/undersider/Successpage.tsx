import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"
import { useAuth } from "../../backend/hooks/useAuth"
import { type Role } from "../../backend/types/index"
import { Check, Users, FolderKanban, HardDrive, AlertTriangle, XCircle } from "lucide-react"
import { Infinity as InfinityIcon } from "lucide-react"

type Status = "waiting" | "success" | "timeout" | "error"

const MAX_WAIT_MS = 90_000

const SuccessPage = () => {
  const { user, profile } = useAuth()
  const [status, setStatus] = useState<Status>("waiting")
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!user?.uid) return

    let timedOut = false
    const start  = Date.now()

    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - start) / 1000))
    }, 1000)

    const timeout = setTimeout(() => {
      timedOut = true
      setStatus("timeout")
      clearInterval(timer)
    }, MAX_WAIT_MS)

    const unsub = onSnapshot(
      doc(db, "users", user.uid),
      snap => {
        if (timedOut) return
        const role = snap.data()?.role as Role | undefined
        if (role === "BuilderPro") {
          clearTimeout(timeout)
          clearInterval(timer)
          setStatus("success")
        }
      },
      err => {
        console.error(err)
        setStatus("error")
        clearTimeout(timeout)
        clearInterval(timer)
      }
    )

    return () => {
      unsub()
      clearTimeout(timeout)
      clearInterval(timer)
    }
  }, [user?.uid])

  return (
    <div className="min-h-screen bg-[#1e2433] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">

        {status === "waiting" && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-white/5" />
              <div className="absolute inset-0 rounded-full border-2 border-t-orange-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-orange-400 text-sm font-mono font-bold">{seconds}s</span>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">Activating Builderpro…</p>
              <p className="text-gray-500 text-sm">
                Your payment is confirmed. We're upgrading your account — this usually takes under 30 seconds.
              </p>
            </div>
            <div className="flex gap-2 items-center text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Waiting for Stripe confirmation
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center mb-6">
              <Check className="text-orange-500" size={36} strokeWidth={2.5} />
            </div>

            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              BuilderPro aktiveret
            </div>

            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
              Welcome to Builderpro
            </h1>
            <p className="text-gray-400 text-base mb-8 leading-relaxed max-w-sm mx-auto">
              Your account has been upgraded. Unlimited boards, team members and all advanced features are now unlocked.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mb-8 text-left">
              {[
                { icon: <InfinityIcon size={18} />, label: "Unlimited boards" },
                { icon: <Users size={18} />, label: "Unlimited members" },
                { icon: <FolderKanban size={18} />, label: "Boards in boards" },
                { icon: <HardDrive size={18} />, label: "20 GB storage" },
              ].map(f => (
                <div key={f.label} className="bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-orange-400">{f.icon}</span>
                  <span className="text-sm text-gray-300">{f.label}</span>
                </div>
              ))}
            </div>

            <Link
              to={`/${profile?.username || user?.uid}/home`}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-orange-500/20 block"
            >
              Go to Dashboard →
            </Link>

            <p className="text-gray-600 text-xs mt-4">
              A receipt has been sent to your email from Stripe.
            </p>
          </div>
        )}

        {status === "timeout" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6">
              <AlertTriangle className="text-yellow-500" size={36} strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Taking longer than expected</h1>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Your payment was successful. The upgrade is on its way — try refreshing in a moment, or contact support if it doesn't appear within a few minutes.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Refresh page
              </button>
              <a
                href="mailto:infobuildernote@gmail.com"
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Contact support
              </a>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <XCircle className="text-red-500" size={36} strokeWidth={2} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Your payment went through but we couldn't activate your plan. Please contact support with your order confirmation.
            </p>
            <a
              href="mailto:infobuildernote@gmail.com"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Contact support
            </a>
          </div>
        )}

      </div>
    </div>
  )
}

export default SuccessPage