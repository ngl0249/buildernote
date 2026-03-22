import { useEffect, useState } from "react"
import { Sparkles, AlertTriangle, Loader2 } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

const API = "https://buildernoteapi.onrender.com"

function formatDate(unix: number) {
  return new Date(unix * 1000).toLocaleDateString("da-DK", {
    day: "2-digit", month: "long", year: "numeric"
  })
}

const SubscriptionSettings = () => {
  const { user } = useAuth()
  const [sub, setSub]           = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [confirm, setConfirm]   = useState(false)
  const [error, setError]       = useState("")

  useEffect(() => {
    if (!user?.uid) return
    fetch(`${API}/subscription/${user.uid}`)
      .then(r => r.json())
      .then(d => { setSub(d.subscription); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user?.uid])

  const handleCancel = async () => {
    if (!user?.uid) return
    setCancelling(true)
    setError("")
    try {
      const r = await fetch(`${API}/subscription/cancel/${user.uid}`, { method: "POST" })
      const d = await r.json()
      if (d.error) throw new Error(d.error)
      setSub((prev: any) => ({ ...prev, cancelAtPeriodEnd: true, currentPeriodEnd: d.currentPeriodEnd }))
      setConfirm(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-6">
      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!sub) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={15} className="text-emerald-500" />
        <h2 className="text-sm font-semibold text-gray-800">BuilderPro subscription</h2>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Status</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sub.cancelAtPeriodEnd ? "bg-yellow-500/10 text-yellow-600" : "bg-emerald-500/10 text-emerald-600"}`}>
            {sub.cancelAtPeriodEnd ? "Cancels at period end" : "Active"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {sub.cancelAtPeriodEnd ? "Access until" : "Next renewal"}
          </span>
          <span className="text-xs font-medium text-gray-700">{formatDate(sub.currentPeriodEnd)}</span>
        </div>
      </div>

      {sub.cancelAtPeriodEnd ? (
        <p className="text-xs text-gray-400 text-center">
          Your subscription has been cancelled and will not renew.
        </p>
      ) : confirm ? (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-600">
              Your BuilderPro access will continue until <strong>{formatDate(sub.currentPeriodEnd)}</strong>, then your account will revert to the free plan.
            </p>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => setConfirm(false)}
              className="flex-1 py-2 rounded-xl text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Keep subscription
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 py-2 rounded-xl text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {cancelling ? <Loader2 size={12} className="animate-spin" /> : "Confirm cancel"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirm(true)}
          className="w-full py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-colors"
        >
          Cancel subscription
        </button>
      )}
    </div>
  )
}

export default SubscriptionSettings