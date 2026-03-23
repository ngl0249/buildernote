import { useCallback, useEffect, useState } from "react"
import { doc, getDoc, setDoc, increment } from "firebase/firestore"
import { db } from "../../../lib/firebase/firebase"

const CLOUD_NAME    = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET as string

const UNLIMITED_ROLES = ["Owner", "Developer", "Moderator", "BuilderPro"]
const DEFAULT_LIMIT_BYTES = 1 * 1024 * 1024 * 1024

export type UploadedFile = {
  url:          string
  publicId:     string
  resourceType: "image" | "video" | "raw"
  format:       string
  bytes:        number
  name:         string
  width?:       number
  height?:      number
}

export type StorageInfo = {
  usedBytes:   number
  limitBytes:  number | null   
  isUnlimited: boolean
}

const storageDocRef = (uid: string) =>
  doc(db, "users", uid, "storage", "usage")

async function getUsedBytes(uid: string): Promise<number> {
  try {
    const snap = await getDoc(storageDocRef(uid))
    return snap.exists() ? (snap.data().usedBytes ?? 0) : 0
  } catch {
    return 0
  }
}

async function adjustUsedBytes(uid: string, delta: number) {
  await setDoc(
    storageDocRef(uid),
    { usedBytes: increment(delta) },
    { merge: true },
  )
}

export function useCloudinaryUpload(uid: string | undefined, userRole: string = "Default") {
  const isUnlimited = UNLIMITED_ROLES.includes(userRole)
  const limitBytes  = isUnlimited ? null : DEFAULT_LIMIT_BYTES

  const [usedBytes, setUsedBytes] = useState(0)
  const [loadingUsage, setLoadingUsage] = useState(true)

  useEffect(() => {
    if (!uid) return
    getUsedBytes(uid).then(b => { setUsedBytes(b); setLoadingUsage(false) })
  }, [uid])

  const storageInfo: StorageInfo = {
    usedBytes,
    limitBytes,
    isUnlimited,
  }

  const upload = useCallback(async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<{ ok: true; file: UploadedFile } | { ok: false; error: string }> => {
    if (!uid) return { ok: false, error: "Ikke logget ind" }

    if (!isUnlimited) {
      const current = await getUsedBytes(uid)
      if (current + file.size > DEFAULT_LIMIT_BYTES) {
        return {
          ok: false,
          error: `Du har nået din lagergrænse på 1 GB. Opgradér til BuilderPro for ubegrænset lagerplads.`,
        }
      }
    }

    return new Promise(resolve => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", UPLOAD_PRESET)
      formData.append("folder", `buildernote/${uid}`)

      const xhr = new XMLHttpRequest()
      const resourceType = file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("image/")
        ? "image"
        : "raw"

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`)

      xhr.upload.onprogress = e => {
        if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100))
      }

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText)
          const uploaded: UploadedFile = {
            url:          data.secure_url,
            publicId:     data.public_id,
            resourceType: resourceType as UploadedFile["resourceType"],
            format:       data.format ?? file.name.split(".").pop() ?? "",
            bytes:        data.bytes ?? file.size,
            name:         file.name,
            width:        data.width,
            height:       data.height,
          }
          await adjustUsedBytes(uid, uploaded.bytes)
          setUsedBytes(prev => prev + uploaded.bytes)
          resolve({ ok: true, file: uploaded })
        } else {
          resolve({ ok: false, error: "Upload fejlede. Prøv igen." })
        }
      }

      xhr.onerror = () => resolve({ ok: false, error: "Netværksfejl under upload." })
      xhr.send(formData)
    })
  }, [uid, isUnlimited])

  const freeBytes = useCallback(async (bytes: number) => {
    if (!uid) return
    await adjustUsedBytes(uid, -Math.abs(bytes))
    setUsedBytes(prev => Math.max(0, prev - bytes))
  }, [uid])

  return { upload, freeBytes, storageInfo, loadingUsage }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024)                  return `${bytes} B`
  if (bytes < 1024 * 1024)           return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024)   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function storagePct(used: number, limit: number | null): number {
  if (!limit) return 0
  return Math.min(100, Math.round((used / limit) * 100))
}