import { X } from "lucide-react"

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="font-semibold text-ink-800">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
