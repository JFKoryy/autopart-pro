import { useRef, useState } from "react"
import { UploadCloud, X, Loader2, ImageIcon } from "lucide-react"
import { uploadImage, deleteImage } from "../services/api"

export default function ImageUpload({ value, onChange }) {
const [isDragging, setIsDragging] = useState(false)
const [uploading, setUploading] = useState(false)
const [error, setError] = useState("")
const inputRef = useRef(null)

async function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith("image/")) {
    setError("Solo se permiten archivos de imagen")
    return
    }
    setError("")
    setUploading(true)
    try {
        // Si ya había una imagen subida, la borramos antes de subir la nueva
        if (value) {
            await deleteImage(value).catch(() => {}) // no bloquea si falla el borrado
        }
        const url = await uploadImage(file)
        onChange(url)
        } catch (err) {
        setError(err.message || "Error al subir la imagen")
        } finally {
        setUploading(false)
        }
    }

    function handleDrop(e) {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        handleFile(file)
    }

    async function handleRemove() {
        if (value) {
        await deleteImage(value).catch(() => {})
        }
        onChange("")
    }

    return (
        <div>
        <label className="mb-1 block text-sm font-medium text-ink-700">Imagen del producto</label>

        {value ? (
            <div className="relative w-fit">
            <img
                src={value}
                alt="Vista previa"
                className="h-40 w-40 rounded-md border border-neutral-200 object-cover"
            />
            <button
                type="button"
                onClick={handleRemove}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                aria-label="Quitar imagen"
            >
                <X size={14} />
            </button>
            </div>
        ) : (
            <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex h-40 w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 text-center transition ${
                isDragging
                ? "border-brand-500 bg-brand-50"
                : "border-neutral-300 hover:border-brand-400 hover:bg-neutral-50"
            }`}
            >
            {uploading ? (
                <>
                <Loader2 size={28} className="animate-spin text-brand-500" />
                <p className="text-sm text-neutral-500">Subiendo imagen...</p>
                </>
            ) : (
                <>
                <UploadCloud size={28} className="text-neutral-400" />
                <p className="text-sm text-neutral-500">
                    Arrastra una imagen aquí o <span className="font-medium text-brand-600">haz clic</span> para seleccionar
                </p>
                <p className="text-xs text-neutral-400">PNG, JPG hasta 7MB</p>
                </>
            )}
            </div>
        )}

        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
        />

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}