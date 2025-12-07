export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formata uma data ISO para tempo relativo (e.g., "5min ago", "2h ago")
 * @param dateStr - ISO date string or undefined or null
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateStr: string | undefined | null): string {
  if (!dateStr) return "";

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Se a diferença é negativa, algo está errado, retorna "just now"
    if (diffMs < 0) return "just now";

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes}min ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    // Para datas mais antigas, mostrar a data formatada
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
