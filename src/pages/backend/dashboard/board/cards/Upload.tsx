import { useRef, useState, useCallback } from "react"
import {
  Upload, X, FileText, Film, Image as ImageIcon,
  CheckCircle2, AlertCircle, Loader2, Grip, Trash2,
} from "lucide-react"
import { type BoardCard } from "../../../types/index"

interface CardShell {
  card:        BoardCard
  onUpdate:    (data: Partial<BoardCard>) => void
  onDelete:    () => void
  onMouseDown: (e: React.MouseEvent) => void
  onSelect:    () => void
  onDeselect:  () => void
}

type UploadedFile = {
  url: string
  name: string
  resourceType: "image" | "video" | "raw"
  format: string
  bytes: number
  publicId: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function getFileIcon(type: UploadedFile["resourceType"]) {
  if (type === "video") return <Film size={14} className="text-purple-400" />
  if (type === "image") return <ImageIcon size={14} className="text-sky-400" />
  return <FileText size={14} className="text-stone-400" />
}

function FilePreview({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  const isImage = file.resourceType === "image"
  const isVideo = file.resourceType === "video"

  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#1a1f2e]">
      {isImage && <img src={file.url} alt={file.name} className="w-full object-cover max-h-48" draggable={false} />}
      {isVideo && <video src={file.url} controls className="w-full max-h-48 bg-black" />}
      {!isImage && !isVideo && (
        <div className="flex items-center gap-3 px-3 py-3">
          {getFileIcon(file.resourceType)}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{file.name}</p>
            <p className="text-[10px] text-gray-500">{formatBytes(file.bytes)}</p>
          </div>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-orange-400 hover:text-orange-300 font-medium transition-colors"
            onClick={e => e.stopPropagation()}
          >
            Åbn
          </a>
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="w-6 h-6 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  )
}

export default function UploadCard({
  card, onUpdate, onDelete, onMouseDown, onSelect, onDeselect,
}: CardShell) {
  const [files, setFiles] = useState<UploadedFile[]>(() => (card.content ? JSON.parse(card.content) : []))
  const [progress, setProgress] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const showFeedback = (ok: boolean, msg: string) => {
    setFeedback({ ok, msg })
    clearTimeout(feedbackTimer.current)
    feedbackTimer.current = setTimeout(() => setFeedback(null), 4000)
  }

  const handleFiles = useCallback(async (fileList: FileList) => {
    const arr = Array.from(fileList)
    for (const file of arr) {
      setProgress(0)
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "YOUR_UNSIGNED_UPLOAD_PRESET") // <-- Ændr til din preset

        const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) throw new Error("Upload fejlede")

        const data = await res.json()
        const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
        const videoExts = ["mp4", "webm", "ogg", "mov"]
        const resourceType: UploadedFile["resourceType"] = videoExts.includes(ext) ? "video" : "image"

        const uploadedFile: UploadedFile = {
          url: data.secure_url,
          name: file.name,
          resourceType,
          format: ext,
          bytes: file.size,
          publicId: data.public_id,
        }

        setFiles(prev => {
          const next = [...prev, uploadedFile]
          onUpdate({ content: JSON.stringify(next) })
          return next
        })
        showFeedback(true, `"${file.name}" uploadet`)
      } catch (err: any) {
        console.error(err)
        showFeedback(false, err.message ?? "Upload fejlede")
      } finally {
        setProgress(null)
      }
    }
  }, [onUpdate])

  const handleRemove = (idx: number) => {
    const next = files.filter((_, i) => i !== idx)
    setFiles(next)
    onUpdate({ content: JSON.stringify(next) })
  }

  const w = card.width ?? 300

  return (
    <div
      style={{ position: "absolute", left: card.x, top: card.y, width: w, zIndex: 1 }}
      className="group"
      onMouseEnter={onSelect}
      onMouseLeave={onDeselect}
    >
      <div className="rounded-2xl bg-[#1e2433] border border-white/10 shadow-xl shadow-black/30 overflow-hidden flex flex-col">

        <div
          onMouseDown={onMouseDown}
          className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5 cursor-grab active:cursor-grabbing select-none"
        >
          <Grip size={12} className="text-gray-600" />
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest flex-1">Upload</span>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md hover:bg-red-500/15 flex items-center justify-center text-gray-600 hover:text-red-400 transition-all"
          >
            <Trash2 size={11} />
          </button>
        </div>

        <div
          className={`relative mx-3 mt-3 rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer ${
            isDragOver ? "border-orange-500/60 bg-orange-500/5" : "border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setIsDragOver(false)
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = "" }}
          />

          {progress !== null ? (
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <Loader2 size={18} className="text-orange-400 animate-spin" />
              <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500">{progress}%</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isDragOver ? "bg-orange-500/20" : "bg-white/5"}`}>
                <Upload size={16} className={isDragOver ? "text-orange-400" : "text-gray-500"} />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-medium text-gray-400">{isDragOver ? "Slip for at uploade" : "Klik eller træk filer hertil"}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">Billeder, video, dokumenter</p>
              </div>
            </div>
          )}
        </div>

        {feedback && (
          <div className={`mx-3 mt-2 flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-medium ${feedback.ok ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {feedback.ok ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
            {feedback.msg}
          </div>
        )}

        {files.length > 0 && (
          <div className="px-3 mt-2 space-y-2 max-h-64 overflow-y-auto">
            {files.map((f, i) => <FilePreview key={f.publicId} file={f} onRemove={() => handleRemove(i)} />)}
          </div>
        )}
      </div>
    </div>
  )
}