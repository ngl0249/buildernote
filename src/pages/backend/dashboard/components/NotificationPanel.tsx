import { useEffect, useRef } from "react"
import type { RefObject } from "react"
import {
  Bell, X, CheckCheck,
  UserPlus, Layout, MessageSquare, Info,
  ThumbsUp, ThumbsDown,
} from "lucide-react"
import { type Notification, type NotificationType } from "../../hooks/useNotifications"


const timeAgo = (ms: number): string => {
  const diff = Date.now() - ms
  const m = Math.floor(diff / 60_000)
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(diff / 86_400_000)
  if (m < 1)  return "just now"
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

const TYPE_META: Record<NotificationType, {
  Icon: React.ElementType
  color: string
  bg:    string
}> = {
  board_invite:  { Icon: UserPlus,       color: "text-orange-400", bg: "bg-orange-500/15" },
  board_change:  { Icon: Layout,         color: "text-sky-400",    bg: "bg-sky-500/15"    },
  board_comment: { Icon: MessageSquare,  color: "text-violet-400", bg: "bg-violet-500/15" },
  system:        { Icon: Info,           color: "text-gray-400",   bg: "bg-white/10"      },
}


interface NotifItemProps {
  notif:      Notification
  onRead:     (id: string) => void
  onDismiss:  (id: string) => void
  onAccept?:  (notif: Notification) => void
  onDecline?: (notif: Notification) => void
}

const NotifItem = ({ notif, onRead, onDismiss, onAccept, onDecline }: NotifItemProps) => {
  const meta = TYPE_META[notif.type]
  const Icon = meta.Icon

  return (
    <div
      onClick={() => { if (!notif.read) onRead(notif.id) }}
      className={`group relative flex gap-3 px-4 py-3.5 transition-colors cursor-pointer ${
        notif.read ? "hover:bg-white/[0.03]" : "bg-white/[0.04] hover:bg-white/[0.07]"
      }`}
    >
      {!notif.read && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
      )}

      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${meta.bg}`}>
        <Icon size={15} className={meta.color} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-snug mb-0.5 ${notif.read ? "text-gray-400" : "text-white"}`}>
          {notif.title}
        </p>
        <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{notif.body}</p>

        {notif.type === "board_invite" && onAccept && onDecline && (
          <div
            className="flex items-center gap-2 mt-2.5"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => onAccept(notif)}
              title="Accept invitation"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-[11px] font-semibold transition-all active:scale-95"
            >
              <ThumbsUp size={11} /> Accept
            </button>
            <button
              onClick={() => onDecline(notif)}
              title="Decline invitation"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-gray-400 hover:text-white text-[11px] font-semibold transition-all active:scale-95"
            >
              <ThumbsDown size={11} /> Decline
            </button>
          </div>
        )}

        <span className="text-[10px] text-gray-600 mt-1.5 block">{timeAgo(notif.createdAt)}</span>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onDismiss(notif.id) }}
        title="Dismiss"
        className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-600 hover:text-gray-300 transition-all flex-shrink-0 mt-0.5"
      >
        <X size={12} />
      </button>
    </div>
  )
}


interface NotificationPanelProps {
  open:          boolean
  notifications: Notification[]
  unreadCount:   number
  loading:       boolean
  onClose:       () => void
  onRead:        (id: string) => void
  onMarkAllRead: () => void
  onDismiss:     (id: string) => void
  onAccept:      (notif: Notification) => void
  onDecline:     (notif: Notification) => void
  anchorRef:     RefObject<HTMLButtonElement | null>
}

const NotificationPanel = ({
  open, notifications, unreadCount, loading, onClose,
  onRead, onMarkAllRead, onDismiss, onAccept, onDecline,
  anchorRef,
}: NotificationPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        panelRef.current  && !panelRef.current.contains(target) &&
        anchorRef.current && !anchorRef.current.contains(target)
      ) onClose()
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [open, onClose, anchorRef])

  if (!open) return null

  const invites = notifications.filter(n => n.type === "board_invite")
  const others  = notifications.filter(n => n.type !== "board_invite")

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="
          fixed z-50 bg-[#161b27] border border-white/10 shadow-2xl shadow-black/40
          flex flex-col overflow-hidden

          bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]
          md:bottom-auto md:left-auto md:right-4 md:top-14
          md:w-96 md:rounded-2xl md:max-h-[calc(100vh-80px)]
        "
        style={{ animation: "notifSlideIn 0.18s ease-out" }}
      >
        <style>{`
          @keyframes notifSlideIn {
            from { opacity: 0; transform: translateY(6px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Bell size={15} className="text-gray-400" />
            <span className="text-sm font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/8 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={13} />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <Bell size={20} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-500 font-medium">All caught up</p>
              <p className="text-xs text-gray-600">No notifications yet</p>
            </div>
          ) : (
            <>
              {invites.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                      Invitations
                    </span>
                  </div>
                  {invites.map(n => (
                    <NotifItem
                      key={n.id}
                      notif={n}
                      onRead={onRead}
                      onDismiss={onDismiss}
                      onAccept={onAccept}
                      onDecline={onDecline}
                    />
                  ))}
                  {others.length > 0 && <div className="h-px bg-white/5 mx-4 my-1" />}
                </div>
              )}

              {others.length > 0 && (
                <div>
                  {invites.length > 0 && (
                    <div className="px-4 pt-3 pb-1">
                      <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                        Activity
                      </span>
                    </div>
                  )}
                  {others.map(n => (
                    <NotifItem
                      key={n.id}
                      notif={n}
                      onRead={onRead}
                      onDismiss={onDismiss}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-white/5 flex-shrink-0">
            <p className="text-[10px] text-gray-600 text-center">
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              {unreadCount > 0 ? ` · ${unreadCount} unread` : " · all read"}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default NotificationPanel