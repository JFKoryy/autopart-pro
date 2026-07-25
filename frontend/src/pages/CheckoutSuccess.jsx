import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams()
    const { clearCart } = useCart()
    const [status, setStatus] = useState("loading") // loading | success | error
    const sessionId = searchParams.get("session_id")

    useEffect(() => {
        if (sessionId) {
        clearCart()
        setStatus("success")
        } else {
        setStatus("error")
        }
    }, [sessionId])

    if (status === "loading") {
        return (
        <div className="py-20 text-center">
            <Loader2 size={40} className="mx-auto animate-spin text-brand-500" />
        </div>
        )
    }

    if (status === "error") {
        return (
        <div className="py-20 text-center text-neutral-500">
            No se pudo confirmar el pago.{" "}
            <Link to="/catalogo" className="font-medium text-brand-600 hover:underline">
            Volver al catálogo
            </Link>
        </div>
        )
    }

    return (
        <div className="py-20 text-center">
        <CheckCircle2 size={56} className="mx-auto text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-ink-800">¡Compra realizada!</h1>
        <p className="mt-1 text-neutral-500">Tu pago fue confirmado y tu pedido está en proceso.</p>
        <Link
            to="/catalogo"
            className="mt-5 inline-block rounded-md bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600"
        >
            Seguir comprando
        </Link>
        </div>
    )
}