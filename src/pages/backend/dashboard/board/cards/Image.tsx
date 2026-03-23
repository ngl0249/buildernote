import { useState, useRef, useCallback } from "react"
import {
  Grip, Trash2, ExternalLink, Film,
  FileText, Image as ImageIcon, Maximize2,
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

type MediaData = {
  url:          string
  name:         string
  resourceType: "image" | "video" | "raw"
  format:       string
  bytes:        number
  width?:       number
  height?:      number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024)                return `${bytes} B`
  if (bytes < 1024 * 1024)        return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export default function ImageCard({
  card, onUpdate, onDelete, onMouseDown, onSelect, onDeselect,
}: CardShell) {
  const media: MediaData | null = card.content
    ? JSON.parse(card.content)
    : null

  const [urlInput,  setUrlInput]  = useState("")
  const [lightbox,  setLightbox]  = useState(false)
  const [imgError,  setImgError]  = useState(false)
  const [uploading, setUploading] = useState(false)

  const isResizing = useRef(false)
  const resizeStart = useRef({ mx: 0, my: 0, w: 0, h: 0 })

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    isResizing.current = true
    resizeStart.current = {
      mx: e.clientX,
      my: e.clientY,
      w:  card.width  ?? 300,
      h:  card.height ?? 240,
    }
    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current) return
      const newW = Math.max(180, resizeStart.current.w + (ev.clientX - resizeStart.current.mx))
      const newH = Math.max(120, resizeStart.current.h + (ev.clientY - resizeStart.current.my))
      onUpdate({ width: newW, height: newH })
    }
    const onUp = () => {
      isResizing.current = false
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }, [card.width, card.height, onUpdate])

  // **Cloudinary Upload**
  const handleFileUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "buildernote")
    setUploading(true)

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
      const videoExts = ["mp4", "webm", "ogg", "mov"]
      const resourceType: MediaData["resourceType"] = videoExts.includes(ext) ? "video" : "image"

      const newMedia: MediaData = {
        url: data.secure_url,
        name: file.name,
        resourceType,
        format: ext,
        bytes: file.size,
      }

      onUpdate({ content: JSON.stringify(newMedia) })
      setImgError(false)
    } catch (err) {
      console.error("Upload fejlede:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleSetUrl = () => {
    if (!urlInput.trim()) return
    const url = urlInput.trim()
    const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? ""
    const videoExts = ["mp4", "webm", "ogg", "mov"]
    const resourceType: MediaData["resourceType"] = videoExts.includes(ext)
      ? "video"
      : ["jpg","jpeg","png","gif","webp","svg","avif"].includes(ext)
      ? "image"
      : "raw"

    const newMedia: MediaData = {
      url,
      name:         url.split("/").pop() ?? "fil",
      resourceType,
      format:       ext,
      bytes:        0,
    }
    onUpdate({ content: JSON.stringify(newMedia) })
    setUrlInput("")
    setImgError(false)
  }

  const w = card.width  ?? 300
  const h = card.height ?? 240

  return (
    <>
      {lightbox && media?.resourceType === "image" && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <img
            src={media.url}
            alt={media.name}
            className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl object-contain"
            draggable={false}
          />
        </div>
      )}

      <div
        style={{ position: "absolute", left: card.x, top: card.y, width: w, zIndex: 1 }}
        className="group"
        onMouseEnter={onSelect}
        onMouseLeave={onDeselect}
      >
        <div
          className="rounded-2xl bg-[#1e2433] border border-white/10 shadow-xl shadow-black/30 overflow-hidden flex flex-col"
          style={{ minHeight: 120 }}
        >
          <div
            onMouseDown={onMouseDown}
            className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5 cursor-grab active:cursor-grabbing select-none shrink-0"
          >
            <Grip size={12} className="text-gray-600" />
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {media?.resourceType === "video"
                ? <Film size={11} className="text-purple-400 shrink-0" />
                : media?.resourceType === "raw"
                ? <FileText size={11} className="text-stone-400 shrink-0" />
                : <ImageIcon size={11} className="text-sky-400 shrink-0" />
              }
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest truncate">
                {media ? media.name : "Image / Media"}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {media && (
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseDown={e => e.stopPropagation()}
                  className="w-5 h-5 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors"
                >
                  <ExternalLink size={11} />
                </a>
              )}
              {media?.resourceType === "image" && !imgError && (
                <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={() => setLightbox(true)}
                  className="w-5 h-5 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors"
                >
                  <Maximize2 size={11} />
                </button>
              )}
              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={onDelete}
                className="w-5 h-5 rounded-md hover:bg-red-500/15 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col" style={{ height: h - 42 }}>
            {!media ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <ImageIcon size={18} className="text-gray-600" />
                </div>
                <p className="text-[11px] text-gray-600 text-center leading-snug">
                  Indsæt en billed-URL eller upload en fil
                </p>
                <div className="w-full flex gap-1.5">
                  <input
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleSetUrl() }}
                    placeholder="https://..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-orange-500/40 transition-colors"
                  />
                  <button
                    onClick={handleSetUrl}
                    disabled={!urlInput.trim()}
                    className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
                  >
                    OK
                  </button>
                  <input
                    type="file"
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id={`upload-${card.id}`}
                  />
                  <label
                    htmlFor={`upload-${card.id}`}
                    className={`px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {uploading ? "Uploader..." : "Upload"}
                  </label>
                </div>
              </div>
            ) : media.resourceType === "image" ? (
              <div className="flex-1 overflow-hidden">
                {imgError ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 px-4">
                    <ImageIcon size={20} className="text-gray-600" />
                    <p className="text-[11px] text-gray-600 text-center">Kunne ikke indlæse billedet</p>
                    <button
                      onClick={() => { onUpdate({ content: undefined }); setImgError(false) }}
                      className="text-[10px] text-orange-400 hover:text-orange-300"
                    >
                      Skift URL
                    </button>
                  </div>
                ) : (
                  <img
                    src={media.url}
                    alt={media.name}
                    onError={() => setImgError(true)}
                    onClick={() => setLightbox(true)}
                    className="w-full h-full object-cover cursor-zoom-in"
                    draggable={false}
                    style={{ height: h - 42 }}
                  />
                )}
              </div>
            ) : media.resourceType === "video" ? (
              <video
                src={media.url}
                controls
                className="w-full bg-black"
                style={{ height: h - 42 }}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
                <FileText size={24} className="text-stone-500" />
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-300 truncate max-w-full">{media.name}</p>
                  {media.bytes > 0 && (
                    <p className="text-[10px] text-gray-600 mt-0.5">{formatBytes(media.bytes)}</p>
                  )}
                </div>
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={12} />
                  Åbn fil
                </a>
                <button
                  onClick={() => onUpdate({ content: undefined })}
                  className="text-[10px] text-gray-600 hover:text-gray-400"
                >
                  Skift fil
                </button>
              </div>
            )}
          </div>

          <div
            onMouseDown={onResizeMouseDown}
            className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end pb-1 pr-1"
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 7L7 1M4 7L7 4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}