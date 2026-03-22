import { useState } from "react"
import {
  Code2, MessageSquareWarning, Sparkles,
  Zap, 
} from "lucide-react"
import Members from "./Stafftabs/Members"
import UsersTrack from "./Stafftabs/UsersTrack"
import SubscriptionsTrack from "./Stafftabs/SubscriptionsTrack"

import { useAuth } from "../../hooks/useAuth"
import { useBoards } from "../../hooks/useBoards"
import { LayoutGrid, FileText, Users, HardDrive, Download, Check, Loader2 } from "lucide-react"


export function AdminMembersTab({ currentUserUid }: { currentUserUid: string }) {
  const [tab, setTab] = useState<"members" | "users" | "subscriptions">("members")

  return (
    <div className="flex flex-col h-full bg-[#eaeaea] font-sans">
      <div className="px-8 py-4 border-b border-stone-200/80 shrink-0">
        <div className="flex gap-2 bg-stone-200/50 rounded-xl p-1 w-fit">
          {[
            { key: "members", label: "Members" },
            { key: "users", label: "User tracking" },
            { key: "subscriptions", label: "Subscriptions" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === t.key ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {tab === "members" && <Members currentUserUid={currentUserUid} />}
        {tab === "users" && <UsersTrack />}
        {tab === "subscriptions" && <SubscriptionsTrack />}
      </div>
    </div>
  )
}

export function ModeratorTab() {
  const [tab, setTab] = useState<"members" | "users">("members")

  return (
    <div className="flex flex-col h-full bg-[#eaeaea] font-sans">
      <div className="px-8 py-4 border-b border-stone-200/80 shrink-0">
        <div className="flex gap-2 bg-stone-200/50 rounded-xl p-1 w-fit">
          {[
            { key: "members", label: "Members" },
            { key: "users", label: "User tracking" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === t.key ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-violet-500 mt-2 flex items-center gap-1">
          <MessageSquareWarning size={10} /> Read-only access — contact an Owner to make changes
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 pointer-events-none select-none opacity-80">
        {tab === "members" && <Members currentUserUid="" readOnly />}
        {tab === "users" && <UsersTrack />}
      </div>
    </div>
  )
}

export function DeveloperTab() {
  const [tab, setTab] = useState<"members" | "users">("members")

  return (
    <div className="flex flex-col h-full bg-[#eaeaea] font-sans">
      <div className="px-8 py-4 border-b border-stone-200/80 shrink-0">
        <div className="flex gap-2 bg-stone-200/50 rounded-xl p-1 w-fit">
          {[
            { key: "members", label: "Members" },
            { key: "users", label: "User tracking" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${tab === t.key ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-sky-500 mt-2 flex items-center gap-1">
          <Code2 size={10} /> View only — role changes require Owner access
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6 pointer-events-none select-none opacity-80">
        {tab === "members" && <Members currentUserUid="" readOnly />}
        {tab === "users" && <UsersTrack />}
      </div>
    </div>
  )
}


export function ProTab() {
  const { user } = useAuth()
  const { boards } = useBoards(user?.uid)
  const [exporting, setExporting] = useState(false)
  const [exportDone, setExportDone] = useState(false)

  const totalCards = boards.reduce((acc, b) => acc + (b.cardCount ?? 0), 0)

  const exportJSON = async () => {
    setExporting(true)
    const data = {
      exportedAt: new Date().toISOString(),
      boards: boards.map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        cardCount: b.cardCount,
        createdAt: b.createdAt,
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `buildernote-export-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExporting(false)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 2500)
  }

  const exportPDF = () => {
    window.print()
  }

  return (
    <div className="flex flex-col h-full bg-[#eaeaea] font-sans">
      <div className="px-8 py-6 border-b border-stone-200/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Sparkles size={15} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-800 tracking-tight">Builderpro Features</h1>
            <p className="text-sm text-stone-400">Exclusive tools for BuilderPro members</p>
          </div>
          <span className="ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-200">
            BuilderPro ✓
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Your overview</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Boards",       value: boards.length,   icon: <LayoutGrid size={15} className="text-emerald-500" />,  accent: "bg-emerald-500/10" },
              { label: "Total cards",  value: totalCards,      icon: <FileText size={15} className="text-sky-500" />,        accent: "bg-sky-500/10" },
              { label: "Board limit",  value: "∞",             icon: <Zap size={15} className="text-orange-500" />,          accent: "bg-orange-500/10" },
              { label: "Team access",  value: "∞",             icon: <Users size={15} className="text-violet-500" />,        accent: "bg-violet-500/10" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.accent}`}>{s.icon}</div>
                <div>
                  <p className="text-[10px] text-stone-400">{s.label}</p>
                  <p className="text-lg font-bold text-stone-800">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Export data</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Download size={14} className="text-sky-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Export as JSON</p>
                  <p className="text-[11px] text-stone-400">All your boards and metadata</p>
                </div>
              </div>
              <button
                onClick={exportJSON}
                disabled={exporting}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {exporting ? <Loader2 size={12} className="animate-spin" /> : exportDone ? <><Check size={12} /> Exported!</> : <><Download size={12} /> Download JSON</>}
              </button>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <FileText size={14} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Export as PDF</p>
                  <p className="text-[11px] text-stone-400">Print or save as PDF</p>
                </div>
              </div>
              <button
                onClick={exportPDF}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={12} /> Download PDF
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Your pro perks</p>
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100">
            {[
              { icon: <Zap size={14} className="text-orange-500" />,       label: "Unlimited boards",         desc: "Create as many boards as you need" },
              { icon: <Users size={14} className="text-violet-500" />,     label: "Unlimited team members",   desc: "Invite as many collaborators as you want" },
              { icon: <LayoutGrid size={14} className="text-sky-500" />,   label: "Boards in boards",         desc: "Nest boards inside other boards" },
              { icon: <HardDrive size={14} className="text-emerald-500" />,label: "20 GB storage",            desc: "Upload and store files and images" },
              { icon: <Download size={14} className="text-blue-500" />,    label: "Export data",              desc: "Export all your data as JSON or PDF" },
              { icon: <Sparkles size={14} className="text-emerald-500" />, label: "Early access",             desc: "Get new features before everyone else" },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center flex-shrink-0">
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700">{p.label}</p>
                  <p className="text-[11px] text-stone-400">{p.desc}</p>
                </div>
                <Check size={14} className="text-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}