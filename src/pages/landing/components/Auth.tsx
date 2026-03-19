import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "../../../lib/firebase/firebase"

const googleProvider = new GoogleAuthProvider()

const Background = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1e2433" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    <svg className="absolute -top-16 -left-16 w-72 h-72 opacity-20" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="80" fill="none" stroke="#f97316" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="55" fill="none" stroke="#f97316" strokeWidth="1" />
      <circle cx="100" cy="100" r="30" fill="none" stroke="#f97316" strokeWidth="0.8" />
    </svg>
    <svg className="absolute top-10 right-10 w-40 h-40 opacity-[0.15]" viewBox="0 0 100 100">
      <rect x="15" y="15" width="70" height="70" fill="none" stroke="#1e2433" strokeWidth="2" transform="rotate(20 50 50)" />
      <rect x="25" y="25" width="50" height="50" fill="none" stroke="#1e2433" strokeWidth="1.5" transform="rotate(20 50 50)" />
    </svg>
    <svg className="absolute bottom-16 left-8 w-48 h-48 opacity-[0.22]" viewBox="0 0 100 100">
      {[...Array(25)].map((_, i) => (
        <circle key={i} cx={(i % 5) * 22 + 5} cy={Math.floor(i / 5) * 22 + 5} r="2" fill="#f97316" />
      ))}
    </svg>
    <svg className="absolute -bottom-8 -right-8 w-64 h-64 opacity-[0.13]" viewBox="0 0 200 200">
      <polygon points="100,10 190,180 10,180" fill="none" stroke="#1e2433" strokeWidth="2" />
      <polygon points="100,40 170,170 30,170" fill="none" stroke="#1e2433" strokeWidth="1" />
    </svg>
    <div className="absolute top-1/3 left-16 w-3 h-3 rounded-full bg-orange-400 opacity-60" />
    <div className="absolute top-2/3 right-24 w-2 h-2 rounded-full bg-orange-500 opacity-50" />
    <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-orange-400 opacity-40" />
  </div>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
)

type Mode = "login" | "signup"

function generateUsername(displayName: string, uid: string): string {
  const base = displayName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")
  return (base || "user") + uid.slice(0, 4)
}

const Auth = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>("signup")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const clearError = () => setError("")

  const createUserDoc = async (uid: string, displayName: string, email: string) => {
    const userRef = doc(db, "users", uid)
    const existing = await getDoc(userRef)
    if (!existing.exists()) {
      const username = generateUsername(displayName, uid)
      await setDoc(userRef, {
        uid,
        displayName,
        username,
        email,
        avatarUrl: "",
        role: "Default",
        createdAt: serverTimestamp(),
      })
      return username
    }
    return existing.data().username ?? uid
  }

  const handleEmailAuth = async () => {
    setError("")
    if (!email || !password) { setError("Please fill in all fields."); return }
    if (mode === "signup" && !firstName) { setError("Please enter your first name."); return }
    setLoading(true)
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        const displayName = [firstName, lastName].filter(Boolean).join(" ")
        await updateProfile(cred.user, { displayName })
        const username = await createUserDoc(cred.user.uid, displayName, email)
        navigate(`/${username}/home`, { replace: true })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        navigate("/dashboard", { replace: true })
      }
    } catch (err: any) {
      const msg: Record<string, string> = {
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Incorrect email or password.",
      }
      setError(msg[err.code] ?? "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setGoogleLoading(true)
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      const { uid, displayName, email } = cred.user
      const username = await createUserDoc(uid, displayName ?? "User", email ?? "")
      navigate(`/${username}/home`, { replace: true })
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const isLogin = mode === "login"

  return (
    <div className="relative min-h-screen bg-[#e8e5e0] flex items-center justify-center px-4">
      <Background />

      <div className="relative z-10 w-full max-w-[400px] bg-white rounded-2xl border border-gray-100 px-8 py-9">
        <div className="text-center mb-7">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {isLogin ? "Welcome back" : "Try Buildernote today"}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin ? "Sign in to your account" : "Free with no time limit"}
          </p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all disabled:opacity-60 mb-3"
        >
          {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
          Sign {isLogin ? "in" : "up"} with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {!isLogin && (
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">First name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={firstName}
                  onChange={e => { setFirstName(e.target.value); clearError() }}
                  placeholder="Jane"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={e => { setLastName(e.target.value); clearError() }}
                placeholder="Doe"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearError() }}
              onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
              placeholder="jane@example.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-gray-600">Password</label>
            {isLogin && (
              <Link to="/reset" className="text-xs text-orange-500 hover:text-orange-600 transition-colors">
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); clearError() }}
              onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
        >
          {loading
            ? <Loader2 size={16} className="animate-spin" />
            : <>{isLogin ? "Sign in" : "Sign up for free"}<ArrowRight size={15} /></>
          }
        </button>

        <p className="text-center text-xs text-gray-500 mt-5">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(isLogin ? "signup" : "login"); setError("") }}
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Auth