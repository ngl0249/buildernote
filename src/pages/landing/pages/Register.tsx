import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth"
import { auth } from "../../../lib/firebase/firebase"
import logo from "/landingimg/navbar/navlogo.webp"

const googleProvider = new GoogleAuthProvider()

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const Register = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName]   = useState("")
  const [email, setEmail]         = useState("")
  const [password, setPassword]   = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreedTerms, setAgreedTerms]   = useState(false)
  const [wantsUpdates, setWantsUpdates] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  const ERROR_MAP: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email":        "Please enter a valid email address.",
    "auth/weak-password":        "Password must be at least 6 characters.",
  }

  const handleRegister = async () => {
    setError("")
    if (!firstName)           { setError("Please enter your first name."); return }
    if (!email || !password)  { setError("Please fill in all fields."); return }
    if (!agreedTerms)         { setError("Please agree to the terms and privacy policy."); return }
    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(cred.user, { displayName: `${firstName} ${lastName}`.trim() })
      navigate("/dashboard")
    } catch (err: any) {
      setError(ERROR_MAP[err.code] ?? "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setGoogleLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate("/dashboard")
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-up failed. Please try again.")
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1e2433] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl px-8 py-10">

        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#1e2433] flex items-center justify-center shadow-lg overflow-hidden">
            <img src={logo} alt="Buildernote logo" className="w-10 h-10 object-contain" />
          </div>
        </div>

        <div className="text-center mb-7">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sign up to Buildernote</h1>
          <p className="text-gray-400 text-sm mt-1">Free with no time limit</p>
        </div>

        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all disabled:opacity-60 mb-3"
        >
          {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
          Sign up with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => { setFirstName(e.target.value); setError("") }}
              placeholder=""
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => { setLastName(e.target.value); setError("") }}
              placeholder=""
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 transition-all"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError("") }}
            onKeyDown={e => e.key === "Enter" && handleRegister()}
            placeholder=""
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 transition-all"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Choose a password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError("") }}
              onKeyDown={e => e.key === "Enter" && handleRegister()}
              placeholder=""
              className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-sm text-gray-800 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={e => { setAgreedTerms(e.target.checked); setError("") }}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-gray-600 leading-snug">
              I agree to the Buildernote{" "}
              <span className="underline cursor-pointer text-gray-700">terms</span>{" "}
              and{" "}
              <span className="underline cursor-pointer text-gray-700">privacy policy</span>
            </span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={wantsUpdates}
              onChange={e => setWantsUpdates(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-gray-600 leading-snug">
              Send me tips & product updates{" "}
              <span className="text-gray-400">(optional)</span>
            </span>
          </label>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-lg transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
            Log in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
          This site is protected by reCAPTCHA and the Google{" "}
          <span className="underline cursor-pointer">terms of service</span>{" "}
          and{" "}
          <span className="underline cursor-pointer">privacy policy</span>{" "}
          apply.
        </p>
      </div>
    </div>
  )
}

export default Register