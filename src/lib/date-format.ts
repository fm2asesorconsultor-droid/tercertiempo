/** Pure date-formatting helpers, no server-only imports — safe for Client Components. */

const DAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatShortDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }).replace(".", "");
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function relativeDayLabel(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  if (isSameCalendarDay(d, now)) return "Hoy";
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (isSameCalendarDay(d, tomorrow)) return "Mañana";
  return DAY_LABELS[d.getDay()];
}

export function matchesDateFilter(date: Date | string, filter: string): boolean {
  if (filter === "Todos") return true;
  const d = new Date(date);
  if (filter === "Hoy" || filter === "Mañana") return relativeDayLabel(d) === filter;
  if (filter === "Sábado") return d.getDay() === 6;
  if (filter === "Domingo") return d.getDay() === 0;
  return true;
}
