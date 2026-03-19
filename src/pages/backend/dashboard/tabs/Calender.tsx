import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, X, Clock, Circle } from "lucide-react"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

type EventColor = "orange" | "blue" | "green" | "purple"

interface CalEvent {
  id: string
  name: string
  time: string
  color: EventColor
}

interface EventMap {
  [key: string]: CalEvent[]
}

const COLOR_STYLES: Record<EventColor, { dot: string; bg: string; text: string; hex: string }> = {
  orange: { dot: "text-orange-400", bg: "bg-orange-500/10", text: "text-orange-600", hex: "#f97316" },
  blue:   { dot: "text-blue-400",   bg: "bg-blue-500/10",   text: "text-blue-600",   hex: "#3b82f6" },
  green:  { dot: "text-emerald-400",bg: "bg-emerald-500/10",text: "text-emerald-600", hex: "#10b981" },
  purple: { dot: "text-violet-400", bg: "bg-violet-500/10", text: "text-violet-600",  hex: "#8b5cf6" },
}

const COLOR_OPTIONS: { value: EventColor; label: string }[] = [
  { value: "orange", label: "Orange" },
  { value: "blue",   label: "Blue"   },
  { value: "green",  label: "Green"  },
  { value: "purple", label: "Purple" },
]

function dateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

function uid() {
  return Math.random().toString(36).slice(2)
}

const Calendar = () => {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [events, setEvents] = useState<EventMap>(() => {
    try { return JSON.parse(localStorage.getItem("bn_cal_events") || "{}") } catch { return {} }
  })
  const [selected, setSelected] = useState<{ y: number; m: number; d: number } | null>(null)
  const [inputName, setInputName] = useState("")
  const [inputTime, setInputTime] = useState("09:00")
  const [inputColor, setInputColor] = useState<EventColor>("orange")

  useEffect(() => {
    try { localStorage.setItem("bn_cal_events", JSON.stringify(events)) } catch {}
  }, [events])

  const { year, month } = current
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const changeMonth = (dir: number) => {
    setCurrent(c => {
      let m = c.month + dir
      let y = c.year
      if (m > 11) { m = 0; y++ }
      if (m < 0)  { m = 11; y-- }
      return { year: y, month: m }
    })
  }

  const addEvent = () => {
    if (!selected || !inputName.trim()) return
    const key = dateKey(selected.y, selected.m, selected.d)
    const newEvent: CalEvent = { id: uid(), name: inputName.trim(), time: inputTime, color: inputColor }
    setEvents(prev => {
      const existing = prev[key] ?? []
      const updated = [...existing, newEvent].sort((a, b) => a.time.localeCompare(b.time))
      return { ...prev, [key]: updated }
    })
    setInputName("")
  }

  const deleteEvent = (key: string, id: string) => {
    setEvents(prev => {
      const updated = (prev[key] ?? []).filter(e => e.id !== id)
      if (updated.length === 0) {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: updated }
    })
  }

  const selectedKey = selected ? dateKey(selected.y, selected.m, selected.d) : null
  const selectedEvents = selectedKey ? (events[selectedKey] ?? []) : []

  const cells: { y: number; m: number; d: number; current: boolean }[] = []
  for (let i = 0; i < firstDay; i++) {
    const d = prevMonthDays - firstDay + 1 + i
    const date = new Date(year, month - 1, d)
    cells.push({ y: date.getFullYear(), m: date.getMonth(), d, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ y: year, m: month, d, current: true })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d)
    cells.push({ y: date.getFullYear(), m: date.getMonth(), d, current: false })
  }

  return (
    <div className="h-full flex flex-col bg-[#eaeaea] overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">

          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-800">
              {MONTHS[month]} <span className="text-gray-500 font-normal">{year}</span>
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}
                className="px-3 py-1.5 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Today
              </button>
              <button onClick={() => changeMonth(-1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/60 text-gray-500 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => changeMonth(1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/60 text-gray-500 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2 flex-shrink-0">
            {WEEKDAYS.map(w => (
              <div key={w} className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-widest py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-fr overflow-hidden">
            {cells.map((cell, i) => {
              const isToday = cell.y === today.getFullYear() && cell.m === today.getMonth() && cell.d === today.getDate()
              const key = dateKey(cell.y, cell.m, cell.d)
              const dayEvents = events[key] ?? []
              const isSelected = selected?.y === cell.y && selected?.m === cell.m && selected?.d === cell.d

              return (
                <div
                  key={i}
                  onClick={() => setSelected({ y: cell.y, m: cell.m, d: cell.d })}
                  className={`rounded-xl p-1.5 cursor-pointer transition-all flex flex-col overflow-hidden
                    ${!cell.current ? "opacity-30" : ""}
                    ${isSelected ? "bg-white shadow-sm" : "bg-white/50 hover:bg-white/80"}
                    ${isToday && !isSelected ? "bg-white" : ""}
                  `}
                  style={isSelected ? { outline: "1.5px solid #f97316" } : isToday ? { outline: "1px solid #f97316" } : {}}
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-0.5 flex-shrink-0
                    ${isToday ? "bg-orange-500 text-white" : "text-gray-600"}
                  `}>
                    {cell.d}
                  </div>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div key={ev.id} className={`text-[10px] px-1 py-0.5 rounded truncate font-medium flex items-center gap-1 ${COLOR_STYLES[ev.color].bg} ${COLOR_STYLES[ev.color].text}`}>
                        <Circle size={5} fill="currentColor" className="flex-shrink-0" />
                        {ev.time} {ev.name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-gray-400 px-1">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {selected && (
          <div className="w-72 bg-[#161b27] border-l border-white/5 flex flex-col flex-shrink-0 overflow-hidden">
            <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-white/5 flex-shrink-0">
              <div>
                <p className="text-white font-semibold text-sm leading-tight">
                  {new Date(selected.y, selected.m, selected.d).toLocaleDateString("en-US", { weekday: "long" })}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {new Date(selected.y, selected.m, selected.d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-gray-400 transition-colors mt-0.5">
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {selectedEvents.length === 0 ? (
                <p className="text-gray-600 text-xs text-center py-6 italic">No events</p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map(ev => (
                    <div key={ev.id} className="flex items-center gap-2.5 bg-white/5 rounded-xl px-3 py-2.5 group">
                      <Circle size={8} fill={COLOR_STYLES[ev.color].hex} color={COLOR_STYLES[ev.color].hex} className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate">{ev.name}</p>
                        <p className="text-gray-500 text-[10px] flex items-center gap-1 mt-0.5">
                          <Clock size={9} />{ev.time}
                        </p>
                      </div>
                      <button
                        onClick={() => selectedKey && deleteEvent(selectedKey, ev.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 pb-4 pt-3 border-t border-white/5 flex-shrink-0 space-y-2">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Add event</p>
              <input
                type="text"
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addEvent()}
                placeholder="Event name..."
                maxLength={40}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
              />
              <input
                type="time"
                value={inputTime}
                onChange={e => setInputTime(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500/50"
              />
              <div className="grid grid-cols-4 gap-1.5">
                {COLOR_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setInputColor(opt.value)}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-all border
                      ${inputColor === opt.value
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/5 bg-white/5 text-gray-500 hover:bg-white/10"
                      }`}
                  >
                    <Circle size={7} fill={COLOR_STYLES[opt.value].hex} color={COLOR_STYLES[opt.value].hex} />
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                onClick={addEvent}
                className="w-full flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 text-xs font-semibold transition-colors"
              >
                <Plus size={13} />Add event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Calendar