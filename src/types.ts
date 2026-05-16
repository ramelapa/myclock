export type TimeFormat = "12" | "24";
export type FontId = "system" | "serif" | "rounded" | "mono" | "readable";
export type ThemeId =
  | "classic"
  | "midnight"
  | "sunrise"
  | "playful"
  | "neon"
  | "high-contrast";
export type ToneName = "classic" | "chime" | "pulse";

export type TabId = "clock" | "alarm" | "timer" | "stopwatch" | "world";

export interface Preferences {
  format: TimeFormat;
  theme: ThemeId;
  font: FontId;
  showSeconds: boolean;
  tone: ToneName;
}

export interface AlarmItem {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeatDaily: boolean;
  triggeredOn?: string;
}

export interface TimerState {
  label: string;
  durationSeconds: number;
  remainingSeconds: number;
  running: boolean;
  endsAt: number | null;
}

export interface StopwatchState {
  running: boolean;
  elapsedMs: number;
  startedAt: number | null;
  laps: number[];
}

export interface WorldClockItem {
  id: string;
  label: string;
  country: string;
  continent: string;
  timeZone: string;
}
