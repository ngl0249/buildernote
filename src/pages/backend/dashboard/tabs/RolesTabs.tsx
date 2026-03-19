import {
  Code2, MessageSquareWarning, Sparkles,
  BarChart2, Activity, FileCode2,
  Flag, AlertTriangle, Zap, Lock,
} from "lucide-react"
import Members from "./OwnerTabs/Members"


function StatCard({ icon, label, value, accent }: {
  icon: React.ReactNode; label: string; value: string; accent: string
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>{icon}</div>
      <div>
        <p className="text-xs text-stone-400">{label}</p>
        <p className="text-lg font-semibold text-stone-800">{value}</p>
      </div>
    </div>
  )
}

function SectionHeader({ icon, title, subtitle, accent }: {
  icon: React.ReactNode; title: string; subtitle: string; accent: string
}) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}>{icon}</div>
      <div>
        <h1 className="text-xl font-semibold text-stone-800 tracking-tight">{title}</h1>
        <p className="text-sm text-stone-400">{subtitle}</p>
      </div>
    </div>
  )
}

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 border-dashed p-6 flex flex-col items-center justify-center gap-2 text-center min-h-[120px]">
      <Lock size={16} className="text-stone-300" />
      <p className="text-sm font-medium text-stone-400">{label}</p>
      <p className="text-xs text-stone-300">Coming soon</p>
    </div>
  )
}


export function AdminMembersTab({ currentUserUid }: { currentUserUid: string }) {
  return <Members currentUserUid={currentUserUid} />
}


export function AdminOverviewTab() {
  return (
    <div className="flex flex-col h-full bg-[#eeeee9] font-sans">
      <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
        <SectionHeader
          icon={<BarChart2 size={15} className="text-orange-500" />}
          title="Overview"
          subtitle="Platform stats and activity"
          accent="bg-orange-500/10"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Stats</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard icon={<Activity size={16} className="text-orange-500" />}  label="Active today"  value="—" accent="bg-orange-500/10" />
            <StatCard icon={<BarChart2 size={16} className="text-orange-500" />} label="Total boards"  value="—" accent="bg-orange-500/10" />
            <StatCard icon={<Zap size={16} className="text-orange-500" />}       label="Total tasks"   value="—" accent="bg-orange-500/10" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Activity</p>
          <ComingSoon label="Activity feed" />
        </div>
      </div>
    </div>
  )
}


export function DeveloperTab() {
  return (
    <div className="flex flex-col h-full bg-[#eeeee9] font-sans">
      <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
        <SectionHeader
          icon={<Code2 size={15} className="text-sky-500" />}
          title="Developer"
          subtitle="Technical stats and developer tools"
          accent="bg-sky-500/10"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Stats</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard icon={<Activity size={16} className="text-sky-500" />}   label="API calls today" value="—" accent="bg-sky-500/10" />
            <StatCard icon={<FileCode2 size={16} className="text-sky-500" />}  label="Active builds"   value="—" accent="bg-sky-500/10" />
            <StatCard icon={<BarChart2 size={16} className="text-sky-500" />}  label="Error rate"      value="—" accent="bg-sky-500/10" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ComingSoon label="API explorer" />
            <ComingSoon label="Logs viewer" />
          </div>
        </div>
      </div>
    </div>
  )
}


export function ModeratorTab() {
  return (
    <div className="flex flex-col h-full bg-[#eeeee9] font-sans">
      <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
        <SectionHeader
          icon={<MessageSquareWarning size={15} className="text-violet-500" />}
          title="Moderator"
          subtitle="Content moderation and reports"
          accent="bg-violet-500/10"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Overview</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard icon={<Flag size={16} className="text-violet-500" />}          label="Open reports"    value="—" accent="bg-violet-500/10" />
            <StatCard icon={<AlertTriangle size={16} className="text-violet-500" />} label="Flagged content" value="—" accent="bg-violet-500/10" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ComingSoon label="Reports queue" />
            <ComingSoon label="Ban list" />
          </div>
        </div>
      </div>
    </div>
  )
}


export function ProTab() {
  return (
    <div className="flex flex-col h-full bg-[#eeeee9] font-sans">
      <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
        <SectionHeader
          icon={<Sparkles size={15} className="text-emerald-500" />}
          title="Pro Features"
          subtitle="Exclusive tools for BuilderPro members"
          accent="bg-emerald-500/10"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Your plan</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard icon={<Zap size={16} className="text-emerald-500" />}      label="Plan"         value="Pro" accent="bg-emerald-500/10" />
            <StatCard icon={<BarChart2 size={16} className="text-emerald-500" />} label="Boards used" value="—"   accent="bg-emerald-500/10" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Pro tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ComingSoon label="Advanced analytics" />
            <ComingSoon label="Export data" />
          </div>
        </div>
      </div>
    </div>
  )
}