import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Camera, Check, Loader2, X } from "lucide-react"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { db, storage } from "../../../lib/firebase/firebase"
import { useAuth } from "../hooks/useAuth"

const ROLE_STYLES: Record<string, { badge: string; desc: string }> = {
  Owner:      { badge: "bg-orange-500/15 text-orange-500 border-orange-500/25",    desc: "Full access to everything" },
  Developer:  { badge: "bg-sky-500/15 text-sky-500 border-sky-500/25",             desc: "Access to dev tools and settings" },
  Moderator:  { badge: "bg-violet-500/15 text-violet-500 border-violet-500/25",    desc: "Can manage content and users" },
  BuilderPro: { badge: "bg-emerald-500/15 text-emerald-500 border-emerald-500/25", desc: "Pro features unlocked" },
  Default:    { badge: "bg-gray-100 text-gray-500 border-gray-200",                desc: "Standard member" },
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"]
const MAX_MB = 5

const ProfilePage = () => {
  const navigate          = useNavigate()
  const { username }      = useParams<{ username: string }>()
  const { user, profile, loading } = useAuth()
  const fileInputRef      = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [avatarUrl, setAvatarUrl]     = useState("")
  const [previewUrl, setPreviewUrl]   = useState<string | null>(null)
  const [uploadFile, setUploadFile]   = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [saving, setSaving]           = useState(false)
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState("")

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "")
      setNewUsername(profile.username ?? "")
      setAvatarUrl(profile.avatarUrl ?? "")
    }
  }, [profile])

  const role      = profile?.role ?? "Default"
  const roleStyle = ROLE_STYLES[role] ?? ROLE_STYLES.Default
  const handle    = username ?? profile?.username ?? user?.uid ?? ""

  const initials = (displayName || "B")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!ALLOWED_TYPES.includes(file.type)) { setError("Only PNG, JPG, GIF and WEBP files are allowed."); return }
    if (file.size > MAX_MB * 1024 * 1024)  { setError(`File must be smaller than ${MAX_MB} MB.`); return }
    setError("")
    setUploadFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const clearAvatar = () => {
    setUploadFile(null)
    setPreviewUrl(null)
    setAvatarUrl("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const uploadAvatar = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!uploadFile || !user) { resolve(avatarUrl); return }
      const ext        = uploadFile.name.split(".").pop()
      const storageRef = ref(storage, `avatars/${user.uid}/avatar.${ext}`)
      const task       = uploadBytesResumable(storageRef, uploadFile)
      task.on(
        "state_changed",
        snap => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        err  => reject(err),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          setUploadProgress(null)
          resolve(url)
        }
      )
    })
  }

  const handleSave = async () => {
    if (!user) return
    setError("")
    setSaving(true)
    try {
      const finalAvatar   = uploadFile ? await uploadAvatar() : avatarUrl
      const cleanUsername = newUsername.replace(/[^a-z0-9_]/gi, "").toLowerCase().slice(0, 20)

      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL:    finalAvatar,
      })

      await updateDoc(doc(db, "users", user.uid), {
        displayName: displayName.trim(),
        username:    cleanUsername,
        avatarUrl:   finalAvatar,
      })

      setAvatarUrl(finalAvatar)
      setUploadFile(null)
      setPreviewUrl(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)

      if (cleanUsername !== handle) {
        navigate(`/${cleanUsername}/profile`, { replace: true })
      }
    } catch (e: any) {
      setError(e.message ?? "Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaeaea] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentAvatar = previewUrl || avatarUrl

  return (
    <div className="min-h-screen bg-[#eaeaea]">
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4">
        <button
          onClick={() => navigate(`/${handle}/home`)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Profile settings</h1>

        <div className="flex items-center gap-5 mb-8">
          <div className="relative flex-shrink-0">
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white shadow-md">
                <span className="text-white text-xl font-bold">{initials}</span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1e2433] rounded-full flex items-center justify-center border-2 border-white hover:bg-orange-500 transition-colors"
            >
              <Camera size={12} className="text-white" />
            </button>
            {currentAvatar && (
              <button
                onClick={clearAvatar}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white hover:bg-red-600 transition-colors"
              >
                <X size={10} className="text-white" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{displayName || "Your name"}</p>
            <p className="text-xs text-gray-400 mt-0.5">@{newUsername || handle}</p>
            <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, GIF or WEBP · max {MAX_MB} MB</p>
          </div>
        </div>

        {uploadProgress !== null && (
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">@</span>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value.replace(/[^a-z0-9_]/gi, "").toLowerCase())}
                placeholder="yourhandle"
                maxLength={20}
                className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              Your profile URL:{" "}
              <span className="text-orange-500">buildernote.com/{newUsername || handle}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
            <input
              type="email"
              value={profile?.email ?? ""}
              disabled
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Your role</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${roleStyle.badge}`}>
                {role}
              </span>
              <span className="text-xs text-gray-500">{roleStyle.desc}</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              Your role is assigned by an admin and cannot be changed here.
            </p>
          </div>

          {error && (
            <div className="px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || uploadProgress !== null}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            {saving
              ? <Loader2 size={15} className="animate-spin" />
              : saved
              ? <><Check size={15} /> Saved!</>
              : "Save changes"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage