import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../../../lib/firebase/firebase"
import Header from "../layout/Header"

const ResetPassword = () => {
  const [email, setEmail]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)
  const [error, setError]       = useState("")

  const handleReset = async () => {
    setError("")
    if (!email) { setError("Please enter your email address."); return }
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      const msg: Record<string, string> = {
        "auth/user-not-found":  "No account found with this email.",
        "auth/invalid-email":   "Please enter a valid email address.",
        "auth/too-many-requests": "Too many requests. Please try again later.",
      }
      setError(msg[err.code] ?? "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e2433] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl px-8 py-10">

        <Header />

        {sent ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              We sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>.
              Check your inbox and follow the instructions.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Didn't receive it? Check your spam folder or try again.
            </p>
            <button
              onClick={() => { setSent(false); setEmail("") }}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              Try a different email
            </button>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={14} />Back to login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Reset your password</h1>
              <p className="text-gray-400 text-sm mt-1">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError("") }}
                  onKeyDown={e => e.key === "Enter" && handleReset()}
                  placeholder="jane@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-lg transition-colors mb-4"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Send reset link"}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={14} />Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword