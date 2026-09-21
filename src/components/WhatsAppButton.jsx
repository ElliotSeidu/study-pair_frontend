import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "../lib/whatsapp";

export default function WhatsAppButton({ phone, message, className, label = "Message on WhatsApp" }) {
  if (!phone) return null;

  return (
    <a
      href={buildWhatsAppLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={
        className ||
        "flex items-center justify-center gap-2 rounded-lg bg-status-confirmed px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-status-confirmed/90"
      }
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </a>
  );
}