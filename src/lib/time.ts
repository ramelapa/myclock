import { TimeFormat, WorldClockItem } from "../types";

export const cityOptions: WorldClockItem[] = [
  { id: "cairo", label: "Cairo", country: "Egypt", continent: "Africa", timeZone: "Africa/Cairo" },
  { id: "lagos", label: "Lagos", country: "Nigeria", continent: "Africa", timeZone: "Africa/Lagos" },
  { id: "johannesburg", label: "Johannesburg", country: "South Africa", continent: "Africa", timeZone: "Africa/Johannesburg" },
  { id: "cape-town", label: "Cape Town", country: "South Africa", continent: "Africa", timeZone: "Africa/Johannesburg" },
  { id: "nairobi", label: "Nairobi", country: "Kenya", continent: "Africa", timeZone: "Africa/Nairobi" },
  { id: "casablanca", label: "Casablanca", country: "Morocco", continent: "Africa", timeZone: "Africa/Casablanca" },
  { id: "accra", label: "Accra", country: "Ghana", continent: "Africa", timeZone: "Africa/Accra" },
  { id: "addis-ababa", label: "Addis Ababa", country: "Ethiopia", continent: "Africa", timeZone: "Africa/Addis_Ababa" },
  { id: "dubai", label: "Dubai", country: "United Arab Emirates", continent: "Asia", timeZone: "Asia/Dubai" },
  { id: "doha", label: "Doha", country: "Qatar", continent: "Asia", timeZone: "Asia/Qatar" },
  { id: "riyadh", label: "Riyadh", country: "Saudi Arabia", continent: "Asia", timeZone: "Asia/Riyadh" },
  { id: "tel-aviv", label: "Tel Aviv", country: "Israel", continent: "Asia", timeZone: "Asia/Jerusalem" },
  { id: "mumbai", label: "Mumbai", country: "India", continent: "Asia", timeZone: "Asia/Kolkata" },
  { id: "delhi", label: "Delhi", country: "India", continent: "Asia", timeZone: "Asia/Kolkata" },
  { id: "singapore", label: "Singapore", country: "Singapore", continent: "Asia", timeZone: "Asia/Singapore" },
  { id: "tokyo", label: "Tokyo", country: "Japan", continent: "Asia", timeZone: "Asia/Tokyo" },
  { id: "seoul", label: "Seoul", country: "South Korea", continent: "Asia", timeZone: "Asia/Seoul" },
  { id: "hong-kong", label: "Hong Kong", country: "Hong Kong", continent: "Asia", timeZone: "Asia/Hong_Kong" },
  { id: "beijing", label: "Beijing", country: "China", continent: "Asia", timeZone: "Asia/Shanghai" },
  { id: "shanghai", label: "Shanghai", country: "China", continent: "Asia", timeZone: "Asia/Shanghai" },
  { id: "bangkok", label: "Bangkok", country: "Thailand", continent: "Asia", timeZone: "Asia/Bangkok" },
  { id: "jakarta", label: "Jakarta", country: "Indonesia", continent: "Asia", timeZone: "Asia/Jakarta" },
  { id: "manila", label: "Manila", country: "Philippines", continent: "Asia", timeZone: "Asia/Manila" },
  { id: "taipei", label: "Taipei", country: "Taiwan", continent: "Asia", timeZone: "Asia/Taipei" },
  { id: "kuala-lumpur", label: "Kuala Lumpur", country: "Malaysia", continent: "Asia", timeZone: "Asia/Kuala_Lumpur" },
  { id: "istanbul", label: "Istanbul", country: "Turkey", continent: "Europe", timeZone: "Europe/Istanbul" },
  { id: "london", label: "London", country: "United Kingdom", continent: "Europe", timeZone: "Europe/London" },
  { id: "paris", label: "Paris", country: "France", continent: "Europe", timeZone: "Europe/Paris" },
  { id: "berlin", label: "Berlin", country: "Germany", continent: "Europe", timeZone: "Europe/Berlin" },
  { id: "rome", label: "Rome", country: "Italy", continent: "Europe", timeZone: "Europe/Rome" },
  { id: "madrid", label: "Madrid", country: "Spain", continent: "Europe", timeZone: "Europe/Madrid" },
  { id: "amsterdam", label: "Amsterdam", country: "Netherlands", continent: "Europe", timeZone: "Europe/Amsterdam" },
  { id: "zurich", label: "Zurich", country: "Switzerland", continent: "Europe", timeZone: "Europe/Zurich" },
  { id: "stockholm", label: "Stockholm", country: "Sweden", continent: "Europe", timeZone: "Europe/Stockholm" },
  { id: "dublin", label: "Dublin", country: "Ireland", continent: "Europe", timeZone: "Europe/Dublin" },
  { id: "lisbon", label: "Lisbon", country: "Portugal", continent: "Europe", timeZone: "Europe/Lisbon" },
  { id: "athens", label: "Athens", country: "Greece", continent: "Europe", timeZone: "Europe/Athens" },
  { id: "warsaw", label: "Warsaw", country: "Poland", continent: "Europe", timeZone: "Europe/Warsaw" },
  { id: "moscow", label: "Moscow", country: "Russia", continent: "Europe", timeZone: "Europe/Moscow" },
  { id: "new-york", label: "New York", country: "United States", continent: "North America", timeZone: "America/New_York" },
  { id: "los-angeles", label: "Los Angeles", country: "United States", continent: "North America", timeZone: "America/Los_Angeles" },
  { id: "chicago", label: "Chicago", country: "United States", continent: "North America", timeZone: "America/Chicago" },
  { id: "denver", label: "Denver", country: "United States", continent: "North America", timeZone: "America/Denver" },
  { id: "miami", label: "Miami", country: "United States", continent: "North America", timeZone: "America/New_York" },
  { id: "dallas", label: "Dallas", country: "United States", continent: "North America", timeZone: "America/Chicago" },
  { id: "toronto", label: "Toronto", country: "Canada", continent: "North America", timeZone: "America/Toronto" },
  { id: "vancouver", label: "Vancouver", country: "Canada", continent: "North America", timeZone: "America/Vancouver" },
  { id: "mexico-city", label: "Mexico City", country: "Mexico", continent: "North America", timeZone: "America/Mexico_City" },
  { id: "guatemala-city", label: "Guatemala City", country: "Guatemala", continent: "North America", timeZone: "America/Guatemala" },
  { id: "panama-city", label: "Panama City", country: "Panama", continent: "North America", timeZone: "America/Panama" },
  { id: "havana", label: "Havana", country: "Cuba", continent: "North America", timeZone: "America/Havana" },
  { id: "sao-paulo", label: "Sao Paulo", country: "Brazil", continent: "South America", timeZone: "America/Sao_Paulo" },
  { id: "buenos-aires", label: "Buenos Aires", country: "Argentina", continent: "South America", timeZone: "America/Argentina/Buenos_Aires" },
  { id: "bogota", label: "Bogota", country: "Colombia", continent: "South America", timeZone: "America/Bogota" },
  { id: "lima", label: "Lima", country: "Peru", continent: "South America", timeZone: "America/Lima" },
  { id: "santiago", label: "Santiago", country: "Chile", continent: "South America", timeZone: "America/Santiago" },
  { id: "quito", label: "Quito", country: "Ecuador", continent: "South America", timeZone: "America/Guayaquil" },
  { id: "montevideo", label: "Montevideo", country: "Uruguay", continent: "South America", timeZone: "America/Montevideo" },
  { id: "caracas", label: "Caracas", country: "Venezuela", continent: "South America", timeZone: "America/Caracas" },
  { id: "la-paz", label: "La Paz", country: "Bolivia", continent: "South America", timeZone: "America/La_Paz" },
  { id: "sydney", label: "Sydney", country: "Australia", continent: "Oceania", timeZone: "Australia/Sydney" },
  { id: "melbourne", label: "Melbourne", country: "Australia", continent: "Oceania", timeZone: "Australia/Melbourne" },
  { id: "brisbane", label: "Brisbane", country: "Australia", continent: "Oceania", timeZone: "Australia/Brisbane" },
  { id: "perth", label: "Perth", country: "Australia", continent: "Oceania", timeZone: "Australia/Perth" },
  { id: "auckland", label: "Auckland", country: "New Zealand", continent: "Oceania", timeZone: "Pacific/Auckland" },
  { id: "wellington", label: "Wellington", country: "New Zealand", continent: "Oceania", timeZone: "Pacific/Auckland" },
  { id: "honolulu", label: "Honolulu", country: "United States", continent: "Oceania", timeZone: "Pacific/Honolulu" },
  { id: "suva", label: "Suva", country: "Fiji", continent: "Oceania", timeZone: "Pacific/Fiji" },
  { id: "port-moresby", label: "Port Moresby", country: "Papua New Guinea", continent: "Oceania", timeZone: "Pacific/Port_Moresby" },
  { id: "mcmurdo", label: "McMurdo", country: "Antarctica", continent: "Antarctica", timeZone: "Antarctica/McMurdo" },
  { id: "palmer", label: "Palmer", country: "Antarctica", continent: "Antarctica", timeZone: "Antarctica/Palmer" },
  { id: "rothera", label: "Rothera", country: "Antarctica", continent: "Antarctica", timeZone: "Antarctica/Rothera" },
  { id: "casey", label: "Casey", country: "Antarctica", continent: "Antarctica", timeZone: "Antarctica/Casey" },
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
