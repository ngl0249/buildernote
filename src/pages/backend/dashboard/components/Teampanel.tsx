import { useState, useRef, useEffect } from "react"
import {
  X, Users, UserPlus, Crown, Pencil, Eye,
  Trash2, ChevronDown, Check, Loader2, Sparkles, Infinity,
} from "lucide-react"
import { type BoardMember, type MemberRole, useTeam, fetchUserProfile } from "../../hooks/Useteam"
import { useAuth } from "../../hooks/useAuth"

const INVITE_LIMIT = 5
const UNLIMITED_ROLES = ["Owner", "Developer", "Moderator", "BuilderPro"]

const ROLE_META: Record<MemberRole, { label: string; icon: React.ElementType; color: string }> = {
  owner:  { label: "Owner",  icon: Crown,  color: "text-orange-400" },
  editor: { label: "Editor", icon: Pencil, color: "text-sky-400"    },
  viewer: { label: "Viewer", icon: Eye,    color: "text-gray-400"   },
}

const Avatar = ({ member }: { member: BoardMember }) => {
  const initials = (member.displayName ?? member.username ?? "?")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  return member.avatarUrl ? (
    <img
      src={member.avatarUrl}
      alt={member.displayName}
      className="w-8 h-8 rounded-full object-cover flex-shrink-0 border-2 border-white/10"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
      <span className="text-white text-[10px] font-bold">{initials}</span>
    </div>
  )
}

const RolePicker = ({
  current, onChange, disabled,
}: { current: MemberRole; onChange: (r: MemberRole) => void; disabled?: boolean }) => {
  const [open, setOpen] = useState(false)
  const meta = ROLE_META[current]
  const Icon = meta.icon

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
          disabled
            ? "text-gray-600 cursor-default"
            : `${meta.color} hover:bg-white/8 cursor-pointer`
        }`}
      >
        <Icon size={11} />
        {meta.label}
        {!disabled && <ChevronDown size={10} className="text-gray-600" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-[60] w-32 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-xl overflow-hidden">
            {(["editor", "viewer"] as MemberRole[]).map(r => {
              const m = ROLE_META[r]
              const I = m.icon
              return (
                <button
                  key={r}
                  onClick={() => { onChange(r); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] hover:bg-white/8 transition-colors"
                >
                  <I size={11} className={m.color} />
                  <span className={m.color}>{m.label}</span>
                  {r === current && <Check size={10} className="ml-auto text-gray-500" />}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

const MemberRow = ({
  member, isOwner, onRemove, onRoleChange,
}: {
  member:       BoardMember
  isOwner:      boolean
  onRemove:     (uid: string) => void
  onRoleChange: (uid: string, role: MemberRole) => void
}) => {
  const isOwnRow = member.role === "owner"

  return (
    <div className="group flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
      <Avatar member={member} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {member.displayName ?? member.uid.slice(0, 8)}
        </p>
        <p className="text-[11px] text-gray-500 truncate">
          @{member.username ?? member.uid.slice(0, 8)}
        </p>
      </div>

      <RolePicker
        current={member.role}
        onChange={r => onRoleChange(member.uid, r)}
        disabled={isOwnRow || !isOwner}
      />

      {isOwner && !isOwnRow && (
        <button
          onClick={() => onRemove(member.uid)}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg hover:bg-red-500/15 flex items-center justify-center text-gray-600 hover:text-red-400 transition-all"
          title="Fjern medlem"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  )
}

interface TeamPanelProps {
  open:        boolean
  onClose:     () => void
  ownerUid:    string
  boardId:     string
  boardTitle:  string
  boardColor:  string
  inviterName: string
  currentUid:  string
  anchorRef:   React.RefObject<HTMLButtonElement | null>
}

const TeamPanel = ({
  open, onClose, ownerUid, boardId, boardTitle, boardColor,
  inviterName, currentUid, anchorRef,
}: TeamPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { profile } = useAuth()
  const inviterRole = profile?.role ?? "Default"
  const isUnlimited = UNLIMITED_ROLES.includes(inviterRole)

  const { members, loading, inviteByUsername, removeMember, changeRole } =
    useTeam(ownerUid, boardId)

  const [ownerProfile, setOwnerProfile] = useState<BoardMember>({
    uid:         ownerUid,
    role:        "owner",
    joinedAt:    0,
    displayName: inviterName,
  })

  useEffect(() => {
    if (!ownerUid) return
    fetchUserProfile(ownerUid).then(p => {
      setOwnerProfile({
        uid:         ownerUid,
        role:        "owner",
        joinedAt:    0,
        displayName: p.displayName ?? inviterName,
        username:    p.username    ?? undefined,
        avatarUrl:   p.avatarUrl   ?? undefined,
      })
    })
  }, [ownerUid, inviterName])

  const [inviteInput, setInviteInput] = useState("")
  const [inviting,    setInviting]    = useState(false)
  const [feedback,    setFeedback]    = useState<{ ok: boolean; msg: string } | null>(null)

  const isOwner = currentUid === ownerUid

  const memberCount = members.filter(m => m.uid !== ownerUid).length
  const atLimit     = !isUnlimited && memberCount >= INVITE_LIMIT

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const t = e.target as Node
      if (
        panelRef.current  && !panelRef.current.contains(t) &&
        anchorRef.current && !anchorRef.current.contains(t)
      ) onClose()
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [open, onClose, anchorRef])

  useEffect(() => {
    if (open && isOwner) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open, isOwner])

  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => setFeedback(null), 3500)
    return () => clearTimeout(t)
  }, [feedback])

  const handleInvite = async () => {
    if (!inviteInput.trim() || atLimit) return
    setInviting(true)
    const res = await inviteByUsername(
      inviterName, boardTitle, boardColor, inviteInput.trim(), "editor", inviterRole,
    )
    setInviting(false)
    setFeedback({
      ok:  res.ok,
      msg: res.ok
        ? `Invitation sendt til @${inviteInput.trim().replace(/^@/, "")}`
        : res.error ?? "Ukendt fejl",
    })
    if (res.ok) setInviteInput("")
  }

  const handleRemove = async (uid: string) => {
    await removeMember(uid)
  }

  if (!open) return null

  const list: BoardMember[] = [
    ownerProfile,
    ...members.filter(m => m.uid !== ownerUid),
  ]

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} />

      <div
        ref={panelRef}
        className="
          fixed z-50 bg-[#161b27] border border-white/10 shadow-2xl shadow-black/50
          flex flex-col overflow-hidden

          bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]
          md:bottom-auto md:left-auto md:right-16 md:top-14
          md:w-80 md:rounded-2xl md:max-h-[calc(100vh-80px)]
        "
        style={{ animation: "teamSlideIn 0.18s ease-out" }}
      >
        <style>{`
          @keyframes teamSlideIn {
            from { opacity: 0; transform: translateY(6px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Users size={15} className="text-gray-400" />
            <span className="text-sm font-semibold text-white">Team</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/8 text-gray-500 text-[10px] font-bold">
              {list.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {isOwner && (
          <div className="px-4 py-3 border-b border-white/5 flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                Invitér via brugernavn
              </p>

              {isUnlimited ? (
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <Sparkles size={10} />
                  <span>Ubegrænset</span>
                  <Infinity size={10} />
                </div>
              ) : (
                <div className={`flex items-center gap-1 text-[10px] font-semibold ${atLimit ? "text-red-400" : "text-gray-500"}`}>
                  <span className={`px-1.5 py-0.5 rounded-md border text-[9px] font-bold ${
                    atLimit
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : memberCount >= INVITE_LIMIT - 1
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-white/5 border-white/10 text-gray-500"
                  }`}>
                    {memberCount}/{INVITE_LIMIT}
                  </span>
                  <span className="text-gray-600">slots</span>
                </div>
              )}
            </div>

            {atLimit && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-red-400 font-medium leading-snug">
                    Du har nået grænsen på {INVITE_LIMIT} medlemmer.
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5 leading-snug">
                    Fjern et medlem for at frigøre en plads, eller opgradér til{" "}
                    <span className="text-emerald-400 font-semibold">BuilderPro</span> for ubegrænset adgang.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <div className={`flex-1 flex items-center gap-2 bg-white/5 border rounded-xl px-3 py-2 transition-colors ${
                atLimit
                  ? "border-white/5 opacity-50"
                  : "border-white/10 focus-within:border-orange-500/50"
              }`}>
                <span className="text-gray-600 text-sm font-mono select-none">@</span>
                <input
                  ref={inputRef}
                  value={inviteInput}
                  onChange={e => setInviteInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleInvite() }}
                  placeholder="brugernavn"
                  disabled={atLimit}
                  className="flex-1 bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none disabled:cursor-not-allowed"
                />
              </div>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteInput.trim() || atLimit}
                className="w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all active:scale-95 flex-shrink-0"
                title="Send invitation"
              >
                {inviting
                  ? <Loader2 size={14} className="animate-spin" />
                  : <UserPlus size={14} />
                }
              </button>
            </div>

            {feedback && (
              <p className={`text-[11px] font-medium ${feedback.ok ? "text-emerald-400" : "text-red-400"}`}>
                {feedback.msg}
              </p>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="px-4 pt-3 pb-1">
                <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                  Medlemmer
                </span>
              </div>
              {list.map(m => (
                <MemberRow
                  key={m.uid}
                  member={m}
                  isOwner={isOwner}
                  onRemove={handleRemove}
                  onRoleChange={changeRole}
                />
              ))}
            </>
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/5 flex-shrink-0">
          <p className="text-[10px] text-gray-600 text-center">
            {isOwner
              ? "Editors kan redigere · Viewers kan kun se"
              : "Kontakt boardets ejer for at ændre adgang"}
          </p>
        </div>
      </div>
    </>
  )
}

export default TeamPanel