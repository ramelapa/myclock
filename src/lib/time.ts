import { TimeFormat, WorldClockItem } from "../types";

export const cityOptions: WorldClockItem[] = [
  { id: "new-york", label: "New York", timeZone: "America/New_York" },
  { id: "los-angeles", label: "Los Angeles", timeZone: "America/Los_Angeles" },
  { id: "chicago", label: "Chicago", timeZone: "America/Chicago" },
  { id: "london", label: "London", timeZone: "Europe/London" },
  { id: "paris", label: "Paris", timeZone: "Europe/Paris" },
  { id: "berlin", label: "Berlin", timeZone: "Europe/Berlin" },
  { id: "dubai", label: "Dubai", timeZone: "Asia/Dubai" },
  { id: "mumbai", label: "Mumbai", timeZone: "Asia/Kolkata" },
  { id: "singapore", label: "Singapore", timeZone: "Asia/Singapore" },
  { id: "tokyo", label: "Tokyo", timeZone: "Asia/Tokyo" },
  { id: "sydney", label: "Sydney", timeZone: "Australia/Sydney" },
  { id: "sao-paulo", label: "Sao Paulo", timeZone: "America/Sao_Paulo" },
  { id: "mexico-city", label: "Mexico City", timeZone: "America/Mexico_City" },
  { id: "toronto", label: "Toronto", timeZone: "America/Toronto" },
  { id: "seoul", label: "Seoul", timeZone: "Asia/Seoul" },
  { id: "hong-kong", label: "Hong Kong", timeZone: "Asia/Hong_Kong" },
];

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function formatClockTime(
  date: Date,
  format: TimeFormat,
  showSeconds: boolean,
  timeZone?: string
) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: format === "12",
    timeZone,
  }).format(date);
}

export function formatDate(date: Date, timeZone?: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(date);
}

export function formatDuration(totalSeconds: number) {
  const bounded = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(bounded / 3600);
  const minutes = Math.floor((bounded % 3600) / 60);
  const seconds = bounded % 60;

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatStopwatch(ms: number) {
  const bounded = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(bounded / 60000);
  const seconds = Math.floor((bounded % 60000) / 1000);
  const centiseconds = Math.floor((bounded % 1000) / 10);
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

export function secondsFromParts(hours: number, minutes: number, seconds = 0) {
  return Math.max(0, hours * 3600 + minutes * 60 + seconds);
}

export function dateKey(date: Date) {
  return date.toLocaleDateString("en-CA");
}

export function timeValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function getTimeZoneOffsetLabel(timeZone: string, date: Date) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    return parts.find((part) => part.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}

export function minutesUntilTime(time: string, now = new Date()) {
  const [hours, minutes] = time.split(":").map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return Math.round((target.getTime() - now.getTime()) / 60000);
}

export function pad(value: number) {
  return value.toString().padStart(2, "0");
}
