import { Phone } from "lucide-react"

type CtaButtonWhatsappProps = {
    className?: string; // 1. Definimos className como uma prop opcional
}

// 1. Adicionamos { className } como um parâmetro (prop) para recebê-lo
export const CtaButtonWhatsapp = ({ className }: CtaButtonWhatsappProps) => {
    const handleWhatsAppClick = () => {
        window.open("https://typebot.damaface.com.br/agendar", "_self")
    }

    return (
        <button
            onClick={handleWhatsAppClick}
            // 2. Usamos a prop className aqui para adicionar as classes externas
            //    O `${className || ''}` garante que funcione mesmo se nenhuma classe for passada.
            className={`relative flex items-center space-x-2 bg-green-600 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 overflow-hidden group hover:shadow-lg hover:shadow-green-600/25 min-h-[40px] h-12 ${className || ''}`}
            style={{ fontSize: "1rem" }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
            <Phone className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative z-10">Avaliação WhatsApp</span>
        </button>
    )
}