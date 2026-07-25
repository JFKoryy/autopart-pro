import { Link } from "react-router-dom"
import { XCircle } from "lucide-react"

export default function CheckoutCancel() {
    return (
        <div className="py-20 text-center">
        <XCircle size={56} className="mx-auto text-red-400" />
        <h1 className="mt-4 text-2xl font-bold text-ink-800">Pago cancelado</h1>
        <p className="mt-1 text-neutral-500">No se realizó ningún cargo. Tu carrito sigue intacto.</p>
        <Link
            to="/checkout"
            className="mt-5 inline-block rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600"
        >
            Volver al checkout
        </Link>
        </div>
    )
}