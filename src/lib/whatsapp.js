/**
 * Converts a local Ghanaian number (e.g. "024 123 4567") into a wa.me link
 * with a pre-filled message. Adjust the "233" prefix if you expand beyond Ghana.
 */
export function buildWhatsAppLink(phone, message = "") {
  const digits = (phone || "").replace(/\D/g, "");
  const intlNumber = digits.startsWith("0") ? `233${digits.slice(1)}` : digits;
  return `https://wa.me/${intlNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats and ensures any WhatsApp group link opens directly in WhatsApp.
 * Supports full URLs (https://chat.whatsapp.com/...) and raw codes.
 */
export function formatWhatsAppGroupLink(link) {
  if (!link) return "";
  const trimmed = String(link).trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("chat.whatsapp.com/")) {
    return `https://${trimmed}`;
  }
  return `https://chat.whatsapp.com/${trimmed}`;
}