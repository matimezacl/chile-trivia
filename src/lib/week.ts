import { dayNumber, EPOCH_DATE } from "./game";

// The daily-game EPOCH (2026-07-17) is a Friday. Weeks start on Mondays, so
// we shift by 4 to align week 0 with the Monday-Sunday window containing the
// epoch (Mon 2026-07-13 through Sun 2026-07-19).
const EPOCH_MONDAY_OFFSET = 4;

// The week number containing a given day. Week 0 = the week of the epoch.
export function weekOf(day: number): number {
  return Math.floor((day + EPOCH_MONDAY_OFFSET) / 7);
}

// The current week number, based on the player's local date.
export function currentWeek(now: Date = new Date()): number {
  return weekOf(dayNumber(now));
}

// The [firstDay, lastDay] range (inclusive) for a given week number.
export function daysInWeek(week: number): [number, number] {
  const start = week * 7 - EPOCH_MONDAY_OFFSET;
  return [Math.max(0, start), start + 6];
}

// True if a week is fully in the past (its last day is behind us).
export function isWeekFinished(week: number, now: Date = new Date()): boolean {
  const [, last] = daysInWeek(week);
  return dayNumber(now) > last;
}

// A short label for a week, based on its Monday date. Used in the champion
// history: "Semana del 13 jul" for Monday July 13.
export function weekLabel(week: number): string {
  const mondayOffset = week * 7 - EPOCH_MONDAY_OFFSET;
  const d = new Date(EPOCH_DATE.getFullYear(), EPOCH_DATE.getMonth(), EPOCH_DATE.getDate() + mondayOffset);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `Semana del ${d.getDate()} ${months[d.getMonth()]}`;
}
