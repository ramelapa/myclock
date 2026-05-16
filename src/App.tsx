import {
  AlarmClock,
  BadgeDollarSign,
  Bell,
  Check,
  Clock3,
  Flag,
  Globe2,
  Maximize2,
  Palette,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Square,
  TimerReset,
  Trash2,
  UsersRound,
  Volume2,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ensureNotificationPermission, notify, playTone } from "./lib/alerts";
import {
  cityOptions,
  createId,
  dateKey,
  formatClockTime,
  formatDate,
  formatDuration,
  formatStopwatch,
  getTimeZoneOffsetLabel,
  minutesUntilTime,
  secondsFromParts,
  timeValue,
} from "./lib/time";
import {
  AlarmItem,
  FontId,
  Preferences,
  StopwatchState,
  TabId,
  ThemeId,
  TimerState,
  WorldClockItem,
} from "./types";

type ThemePreset = {
  id: ThemeId;
  label: string;
  mood: string;
  ageGroup: string;
  description: string;
  swatches: string[];
};

type FontOption = {
  id: FontId;
  label: string;
  description: string;
};

type AdPlacement = "top" | "inline" | "rail";

const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID?.trim() ?? "";
const adSlots: Record<AdPlacement, string> = {
  top: import.meta.env.VITE_ADSENSE_SLOT_TOP?.trim() ?? "",
  inline: import.meta.env.VITE_ADSENSE_SLOT_INLINE?.trim() ?? "",
  rail: import.meta.env.VITE_ADSENSE_SLOT_RAIL?.trim() ?? "",
};

const themePresets: ThemePreset[] = [
  {
    id: "classic",
    label: "Classic",
    mood: "Clear",
    ageGroup: "Everyone",
    description: "Balanced contrast for everyday clock use.",
    swatches: ["#126257", "#b84e43", "#f6f6f1"],
  },
  {
    id: "midnight",
    label: "Midnight",
    mood: "Focused",
    ageGroup: "Adults",
    description: "Low-light palette for night timers and deep work.",
    swatches: ["#53b6a7", "#e27a69", "#151716"],
  },
  {
    id: "sunrise",
    label: "Sunrise",
    mood: "Calm",
    ageGroup: "Adults",
    description: "Soft morning tones for routines and planning.",
    swatches: ["#9a5a32", "#2f6f80", "#fff7ee"],
  },
  {
    id: "playful",
    label: "Playful",
    mood: "Bright",
    ageGroup: "Kids",
    description: "Friendly color and softer contrast for younger users.",
    swatches: ["#e0567a", "#2f82bd", "#f8fbff"],
  },
  {
    id: "neon",
    label: "Neon",
    mood: "Energetic",
    ageGroup: "Teens",
    description: "High-energy dark mode for workouts and quick timers.",
    swatches: ["#00c2ff", "#ff5aa5", "#131625"],
  },
  {
    id: "high-contrast",
    label: "High Contrast",
    mood: "Readable",
    ageGroup: "Seniors",
    description: "Larger base type and stronger contrast for readability.",
    swatches: ["#0047ab", "#c2410c", "#ffffff"],
  },
];

const fontOptions: FontOption[] = [
  {
    id: "system",
    label: "System",
    description: "Native interface font for general use.",
  },
  {
    id: "serif",
    label: "Serif",
    description: "Editorial numerals and warmer long-form labels.",
  },
  {
    id: "rounded",
    label: "Rounded",
    description: "Softer letterforms for kids and casual use.",
  },
  {
    id: "mono",
    label: "Mono",
    description: "Fixed-width timing for stopwatch-heavy workflows.",
  },
  {
    id: "readable",
    label: "Readable",
    description: "Wide, high-legibility text for quick scanning.",
  },
];

const defaultPreferences: Preferences = {
  format: "12",
  theme: "classic",
  font: "system",
  showSeconds: true,
  tone: "classic",
};

const defaultTimer: TimerState = {
  label: "Focus timer",
  durationSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  running: false,
  endsAt: null,
};

const defaultStopwatch: StopwatchState = {
  running: false,
  elapsedMs: 0,
  startedAt: null,
  laps: [],
};

const defaultWorldClocks = cityOptions.filter((city) =>
  ["new-york", "london", "tokyo"].includes(city.id)
);

const timerPresets = [
  { label: "5m", seconds: 5 * 60 },
  { label: "10m", seconds: 10 * 60 },
  { label: "25m", seconds: 25 * 60 },
  { label: "45m", seconds: 45 * 60 },
  { label: "1h", seconds: 60 * 60 },
];

const defaultCitySuggestionIds = [
  "new-york",
  "london",
  "tokyo",
  "dubai",
  "lagos",
  "sao-paulo",
  "sydney",
  "auckland",
  "mcmurdo",
];

const tabs: Array<{ id: TabId; label: string; icon: typeof Clock3 }> = [
  { id: "clock", label: "Clock", icon: Clock3 },
  { id: "alarm", label: "Alarm", icon: AlarmClock },
  { id: "timer", label: "Timer", icon: TimerReset },
  { id: "stopwatch", label: "Stopwatch", icon: Flag },
  { id: "world", label: "World", icon: Globe2 },
];

function App() {
  const [now, setNow] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabId>("clock");
  const [preferences, setPreferences] = useLocalStorage<Preferences>(
    "myclock:preferences",
    defaultPreferences
  );
  const [alarms, setAlarms] = useLocalStorage<AlarmItem[]>("myclock:alarms", []);
  const [timer, setTimer] = useLocalStorage<TimerState>("myclock:timer", defaultTimer);
  const [stopwatch, setStopwatch] = useLocalStorage<StopwatchState>(
    "myclock:stopwatch",
    defaultStopwatch
  );
  const [worldClocks, setWorldClocks] = useLocalStorage<WorldClockItem[]>(
    "myclock:world-clocks",
    defaultWorldClocks
  );
  const [alarmTime, setAlarmTime] = useState(() => nextHourValue());
  const [alarmLabel, setAlarmLabel] = useState("Wake up");
  const [cityQuery, setCityQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationState, setNotificationState] = useState(() =>
    "Notification" in window ? Notification.permission : "unsupported"
  );
  const alarmMinuteRef = useRef("");
  const timerFinishedRef = useRef(false);
  const currentThemeId = normalizeTheme(preferences.theme);
  const currentTheme =
    themePresets.find((theme) => theme.id === currentThemeId) ?? themePresets[0];
  const currentFontId = normalizeFont(preferences.font);
  const cityMatches = useMemo(() => getCityMatches(cityQuery), [cityQuery]);
  const selectedCity = useMemo(() => findCityFromQuery(cityQuery), [cityQuery]);

  useAdsenseScript(adsenseClientId);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 250);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = currentThemeId;
  }, [currentThemeId]);

  useEffect(() => {
    document.documentElement.dataset.font = currentFontId;
  }, [currentFontId]);

  useEffect(() => {
    if (preferences.theme === currentThemeId && preferences.font === currentFontId) {
      return;
    }

    setPreferences((current) => ({
      ...current,
      theme: currentThemeId,
      font: currentFontId,
    }));
  }, [currentFontId, currentThemeId, preferences.font, preferences.theme, setPreferences]);

  const displayedTimerSeconds = useMemo(() => {
    if (!timer.running || !timer.endsAt) {
      return timer.remainingSeconds;
    }

    return Math.max(0, Math.ceil((timer.endsAt - now.getTime()) / 1000));
  }, [now, timer]);

  const stopwatchMs = useMemo(() => {
    if (!stopwatch.running || !stopwatch.startedAt) {
      return stopwatch.elapsedMs;
    }

    return stopwatch.elapsedMs + now.getTime() - stopwatch.startedAt;
  }, [now, stopwatch]);

  const timerProgress = timer.durationSeconds
    ? 1 - displayedTimerSeconds / timer.durationSeconds
    : 0;

  const nextAlarm = useMemo(
    () =>
      alarms
        .filter((alarm) => alarm.enabled)
        .map((alarm) => ({ ...alarm, minutes: minutesUntilTime(alarm.time, now) }))
        .sort((a, b) => a.minutes - b.minutes)[0],
    [alarms, now]
  );

  const clockInsights = useMemo(() => {
    const insights: string[] = [];

    if (timer.running) {
      insights.push(`Timer is running with ${formatDuration(displayedTimerSeconds)} left.`);
    }

    if (nextAlarm) {
      insights.push(
        `Next alarm is ${nextAlarm.label || "untitled"} in ${formatDuration(
          nextAlarm.minutes * 60
        )}.`
      );
    }

    if (worldClocks.length >= 3) {
      insights.push("World clocks are ready for quick scheduling checks.");
    }

    if (insights.length === 0) {
      insights.push("Set an alarm or start a timer to create a useful time anchor.");
    }

    return insights;
  }, [displayedTimerSeconds, nextAlarm, timer.running, worldClocks.length]);

  useEffect(() => {
    const minuteStamp = `${dateKey(now)}-${timeValue(now)}`;

    if (alarmMinuteRef.current === minuteStamp) {
      return;
    }

    alarmMinuteRef.current = minuteStamp;

    const today = dateKey(now);
    const currentTime = timeValue(now);
    const dueAlarms = alarms.filter(
      (alarm) =>
        alarm.enabled && alarm.time === currentTime && alarm.triggeredOn !== today
    );

    if (dueAlarms.length === 0) {
      return;
    }

    dueAlarms.forEach((alarm) => {
      playTone(preferences.tone);
      notify(alarm.label || "Alarm", `It is ${alarm.time}.`);
    });

    setAlarms((current) =>
      current.map((alarm) =>
        dueAlarms.some((due) => due.id === alarm.id)
          ? {
              ...alarm,
              enabled: alarm.repeatDaily,
              triggeredOn: today,
            }
          : alarm
      )
    );
    setActiveTab("alarm");
  }, [alarms, now, preferences.tone, setAlarms]);

  useEffect(() => {
    if (!timer.running || !timer.endsAt) {
      timerFinishedRef.current = false;
      return;
    }

    if (now.getTime() < timer.endsAt || timerFinishedRef.current) {
      return;
    }

    timerFinishedRef.current = true;
    playTone(preferences.tone);
    notify(timer.label || "Timer", "Countdown complete.");
    setTimer((current) => ({
      ...current,
      running: false,
      remainingSeconds: 0,
      endsAt: null,
    }));
    setActiveTab("timer");
  }, [now, preferences.tone, setTimer, timer]);

  function addAlarm(time = alarmTime, label = alarmLabel, repeatDaily = true) {
    setAlarms((current) =>
      [
        ...current,
        {
          id: createId("alarm"),
          time,
          label: label.trim() || "Alarm",
          enabled: true,
          repeatDaily,
        },
      ].sort((a, b) => a.time.localeCompare(b.time))
    );
  }

  function removeAlarm(id: string) {
    setAlarms((current) => current.filter((alarm) => alarm.id !== id));
  }

  function toggleAlarm(id: string) {
    setAlarms((current) =>
      current.map((alarm) =>
        alarm.id === id
          ? { ...alarm, enabled: !alarm.enabled, triggeredOn: undefined }
          : alarm
      )
    );
  }

  function snoozeAlarm(alarm: AlarmItem) {
    const snoozeAt = new Date(Date.now() + 9 * 60 * 1000);
    addAlarm(timeValue(snoozeAt), `${alarm.label || "Alarm"} snooze`, false);
  }

  function setTimerDuration(seconds: number, label = timer.label) {
    const boundedSeconds = Math.max(1, seconds);
    setTimer({
      label,
      durationSeconds: boundedSeconds,
      remainingSeconds: boundedSeconds,
      running: false,
      endsAt: null,
    });
  }

  function updateTimerPart(part: "hours" | "minutes" | "seconds", value: number) {
    const hours = Math.floor(timer.durationSeconds / 3600);
    const minutes = Math.floor((timer.durationSeconds % 3600) / 60);
    const seconds = timer.durationSeconds % 60;
    const next = {
      hours,
      minutes,
      seconds,
      [part]: Math.max(0, value),
    };

    setTimerDuration(
      secondsFromParts(next.hours, next.minutes, next.seconds),
      timer.label
    );
  }

  function startTimer() {
    const seconds = displayedTimerSeconds > 0 ? displayedTimerSeconds : timer.durationSeconds;
    setTimer((current) => ({
      ...current,
      remainingSeconds: seconds,
      running: true,
      endsAt: Date.now() + seconds * 1000,
    }));
  }

  function pauseTimer() {
    setTimer((current) => ({
      ...current,
      running: false,
      remainingSeconds: displayedTimerSeconds,
      endsAt: null,
    }));
  }

  function resetTimer() {
    setTimer((current) => ({
      ...current,
      running: false,
      remainingSeconds: current.durationSeconds,
      endsAt: null,
    }));
  }

  function startStopwatch() {
    setStopwatch((current) => ({
      ...current,
      running: true,
      startedAt: Date.now(),
    }));
  }

  function pauseStopwatch() {
    setStopwatch((current) => ({
      ...current,
      running: false,
      elapsedMs: stopwatchMs,
      startedAt: null,
    }));
  }

  function resetStopwatch() {
    setStopwatch(defaultStopwatch);
  }

  function addLap() {
    setStopwatch((current) => ({
      ...current,
      laps: [stopwatchMs, ...current.laps],
    }));
  }

  function addWorldClock(city?: WorldClockItem) {
    const selected = city ?? selectedCity ?? cityMatches[0];

    if (!selected) {
      return;
    }

    setWorldClocks((current) =>
      current.some((clock) => clock.id === selected.id)
        ? current
        : [...current, selected].sort((a, b) => a.label.localeCompare(b.label))
    );
    setCityQuery("");
  }

  function removeWorldClock(id: string) {
    setWorldClocks((current) => current.filter((clock) => clock.id !== id));
  }

  function selectTheme(theme: ThemeId) {
    setPreferences((current) => ({ ...current, theme }));
  }

  function selectFont(font: FontId) {
    setPreferences((current) => ({ ...current, font }));
  }

  function cycleTheme() {
    const index = themePresets.findIndex((theme) => theme.id === currentThemeId);
    const nextTheme = themePresets[(index + 1) % themePresets.length];
    selectTheme(nextTheme.id);
  }

  async function requestNotifications() {
    const result = await ensureNotificationPermission();
    setNotificationState(result);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#clock" onClick={() => setActiveTab("clock")}>
          <span className="brand-mark">
            <Clock3 size={22} aria-hidden="true" />
          </span>
          <span>
            <strong>MyClock</strong>
            <small>{formatDate(now)}</small>
          </span>
        </a>

        <div className="header-actions">
          <span className="mini-clock">
            {formatClockTime(now, preferences.format, false)}
          </span>
          <button
            className="icon-button"
            type="button"
            aria-label="Test alert sound"
            title="Test alert sound"
            onClick={() => playTone(preferences.tone)}
          >
            <Volume2 size={18} aria-hidden="true" />
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Cycle theme"
            title={`Theme: ${currentTheme.label}`}
            onClick={cycleTheme}
          >
            <Palette size={18} aria-hidden="true" />
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Open settings"
            title="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav className="tab-bar" aria-label="Clock tools">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              className={activeTab === tab.id ? "tab active" : "tab"}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <main className="app-main">
        <section className="hero-band fullscreenable" id="widget-main-clock">
          <div className="hero-actions">
            <FullscreenButton label="main clock" targetId="widget-main-clock" />
          </div>
          <div className="hero-copy">
            <span className="eyebrow">My Time</span>
            <h1>{formatClockTime(now, preferences.format, preferences.showSeconds)}</h1>
            <p>{formatDate(now)}</p>
          </div>
          <div className="dial" aria-hidden="true">
            <span
              className="hand hour"
              style={{ transform: `rotate(${hourDegrees(now)}deg)` }}
            />
            <span
              className="hand minute"
              style={{ transform: `rotate(${now.getMinutes() * 6}deg)` }}
            />
            <span
              className="hand second"
              style={{ transform: `rotate(${now.getSeconds() * 6}deg)` }}
            />
            <span className="pin" />
          </div>
        </section>

        <AdUnit placement="top" title="Top banner ad" />

        {activeTab === "clock" && (
          <section className="tool-grid">
            <article className="panel wide fullscreenable" id="widget-clock-display">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">Clock</span>
                  <h2>Display</h2>
                </div>
                <WidgetTools label="clock display" targetId="widget-clock-display">
                  <Clock3 size={22} aria-hidden="true" />
                </WidgetTools>
              </div>

              <div className="display-stack">
                <time className="display-time">
                  {formatClockTime(now, preferences.format, preferences.showSeconds)}
                </time>
                <time className="display-date">{formatDate(now)}</time>
              </div>

              <div className="control-grid">
                <label className="field">
                  <span>Format</span>
                  <select
                    value={preferences.format}
                    onChange={(event) =>
                      setPreferences((current) => ({
                        ...current,
                        format: event.target.value as Preferences["format"],
                      }))
                    }
                  >
                    <option value="12">12-hour</option>
                    <option value="24">24-hour</option>
                  </select>
                </label>

                <label className="field checkbox-field">
                  <input
                    type="checkbox"
                    checked={preferences.showSeconds}
                    onChange={(event) =>
                      setPreferences((current) => ({
                        ...current,
                        showSeconds: event.target.checked,
                      }))
                    }
                  />
                  <span>Seconds</span>
                </label>

                <label className="field">
                  <span>Tone</span>
                  <select
                    value={preferences.tone}
                    onChange={(event) =>
                      setPreferences((current) => ({
                        ...current,
                        tone: event.target.value as Preferences["tone"],
                      }))
                    }
                  >
                    <option value="classic">Classic</option>
                    <option value="chime">Chime</option>
                    <option value="pulse">Pulse</option>
                  </select>
                </label>

                <label className="field">
                  <span>Theme</span>
                  <select
                    value={currentThemeId}
                    onChange={(event) => selectTheme(event.target.value as ThemeId)}
                  >
                    {themePresets.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.label} - {theme.ageGroup}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={requestNotifications}
                >
                  <Bell size={17} aria-hidden="true" />
                  <span>
                    {notificationState === "granted"
                      ? "Notifications on"
                      : "Enable notifications"}
                  </span>
                </button>
              </div>
            </article>

            <div className="side-stack">
              <article className="panel fullscreenable" id="widget-theme-studio">
                <div className="panel-heading">
                  <div>
                    <span className="section-kicker">Themes</span>
                    <h2>Theme Studio</h2>
                  </div>
                  <WidgetTools label="theme studio" targetId="widget-theme-studio">
                    <Sparkles size={22} aria-hidden="true" />
                  </WidgetTools>
                </div>

                <div className="theme-grid">
                  {themePresets.map((theme) => (
                    <button
                      className={
                        theme.id === currentThemeId ? "theme-card active" : "theme-card"
                      }
                      key={theme.id}
                      type="button"
                      onClick={() => selectTheme(theme.id)}
                    >
                      <span className="theme-card-title">
                        <strong>{theme.label}</strong>
                        <small>{theme.mood}</small>
                      </span>
                      <span className="swatches" aria-hidden="true">
                        {theme.swatches.map((swatch) => (
                          <span
                            key={`${theme.id}-${swatch}`}
                            style={{ backgroundColor: swatch }}
                          />
                        ))}
                      </span>
                      <span className="theme-audience">
                        <UsersRound size={15} aria-hidden="true" />
                        {theme.ageGroup}
                      </span>
                      <span className="theme-description">{theme.description}</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="panel fullscreenable" id="widget-time-anchor">
                <div className="panel-heading">
                  <div>
                    <span className="section-kicker">Signals</span>
                    <h2>Time Anchor</h2>
                  </div>
                  <WidgetTools label="time anchor" targetId="widget-time-anchor">
                    <WandSparkles size={22} aria-hidden="true" />
                  </WidgetTools>
                </div>
                <div className="insight-list">
                  {clockInsights.map((insight) => (
                    <p key={insight}>{insight}</p>
                  ))}
                </div>
                {nextAlarm && (
                  <div className="stat-row">
                    <span>Alarm</span>
                    <strong>{formatDuration(nextAlarm.minutes * 60)}</strong>
                  </div>
                )}
              </article>

              <AdUnit placement="rail" title="Sidebar ad" />
            </div>
          </section>
        )}

        {activeTab === "alarm" && (
          <section className="tool-grid">
            <article className="panel fullscreenable" id="widget-new-alarm">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">Alarm</span>
                  <h2>New Alarm</h2>
                </div>
                <WidgetTools label="new alarm" targetId="widget-new-alarm">
                  <AlarmClock size={22} aria-hidden="true" />
                </WidgetTools>
              </div>

              <div className="stack-form">
                <label className="field">
                  <span>Time</span>
                  <input
                    type="time"
                    value={alarmTime}
                    onChange={(event) => setAlarmTime(event.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Label</span>
                  <input
                    type="text"
                    value={alarmLabel}
                    onChange={(event) => setAlarmLabel(event.target.value)}
                  />
                </label>
                <button className="primary-button" type="button" onClick={() => addAlarm()}>
                  <Plus size={18} aria-hidden="true" />
                  <span>Add alarm</span>
                </button>
              </div>
            </article>

            <article className="panel wide fullscreenable" id="widget-alarm-list">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">{alarms.length} saved</span>
                  <h2>Alarms</h2>
                </div>
                <WidgetTools label="alarms" targetId="widget-alarm-list">
                  <Bell size={22} aria-hidden="true" />
                </WidgetTools>
              </div>

              <div className="list">
                {alarms.length === 0 && <p className="empty">No alarms set.</p>}
                {alarms.map((alarm) => (
                  <div className="list-item" key={alarm.id}>
                    <button
                      className={alarm.enabled ? "status-pill enabled" : "status-pill"}
                      type="button"
                      onClick={() => toggleAlarm(alarm.id)}
                    >
                      {alarm.enabled ? <Check size={15} /> : <Square size={15} />}
                      <span>{alarm.enabled ? "On" : "Off"}</span>
                    </button>
                    <div className="list-primary">
                      <strong>{alarm.time}</strong>
                      <span>{alarm.label}</span>
                    </div>
                    <span className="muted">
                      {alarm.repeatDaily ? "Daily" : "Once"} -{" "}
                      {formatDuration(minutesUntilTime(alarm.time, now) * 60)}
                    </span>
                    <div className="row-actions">
                      <button
                        className="icon-button"
                        type="button"
                        aria-label={`Snooze ${alarm.label}`}
                        title="Snooze"
                        onClick={() => snoozeAlarm(alarm)}
                      >
                        <TimerReset size={17} />
                      </button>
                      <button
                        className="icon-button danger"
                        type="button"
                        aria-label={`Delete ${alarm.label}`}
                        title="Delete"
                        onClick={() => removeAlarm(alarm.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "timer" && (
          <section className="tool-grid">
            <article className="panel wide fullscreenable" id="widget-timer">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">Timer</span>
                  <h2>{timer.label}</h2>
                </div>
                <WidgetTools label="timer" targetId="widget-timer">
                  <TimerReset size={22} aria-hidden="true" />
                </WidgetTools>
              </div>

              <div className="timer-display">
                <div
                  className="progress-ring"
                  style={{ ["--progress" as string]: `${timerProgress * 360}deg` }}
                >
                  <time>{formatDuration(displayedTimerSeconds)}</time>
                </div>
              </div>

              <div className="button-row centered">
                {timer.running ? (
                  <button className="primary-button" type="button" onClick={pauseTimer}>
                    <Pause size={18} />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button className="primary-button" type="button" onClick={startTimer}>
                    <Play size={18} />
                    <span>Start</span>
                  </button>
                )}
                <button className="secondary-button" type="button" onClick={resetTimer}>
                  <RotateCcw size={18} />
                  <span>Reset</span>
                </button>
              </div>
            </article>

            <article className="panel fullscreenable" id="widget-timer-presets">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">Duration</span>
                  <h2>Preset</h2>
                </div>
                <WidgetTools label="timer presets" targetId="widget-timer-presets">
                  <WandSparkles size={22} aria-hidden="true" />
                </WidgetTools>
              </div>

              <label className="field">
                <span>Label</span>
                <input
                  type="text"
                  value={timer.label}
                  onChange={(event) =>
                    setTimer((current) => ({ ...current, label: event.target.value }))
                  }
                />
              </label>

              <div className="duration-grid">
                <label className="field">
                  <span>Hours</span>
                  <input
                    type="number"
                    min="0"
                    value={Math.floor(timer.durationSeconds / 3600)}
                    onChange={(event) => updateTimerPart("hours", Number(event.target.value))}
                    disabled={timer.running}
                  />
                </label>
                <label className="field">
                  <span>Minutes</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={Math.floor((timer.durationSeconds % 3600) / 60)}
                    onChange={(event) =>
                      updateTimerPart("minutes", Number(event.target.value))
                    }
                    disabled={timer.running}
                  />
                </label>
                <label className="field">
                  <span>Seconds</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timer.durationSeconds % 60}
                    onChange={(event) =>
                      updateTimerPart("seconds", Number(event.target.value))
                    }
                    disabled={timer.running}
                  />
                </label>
              </div>

              <div className="preset-grid">
                {timerPresets.map((preset) => (
                  <button
                    className="secondary-button compact"
                    key={preset.label}
                    type="button"
                    onClick={() => setTimerDuration(preset.seconds, timer.label)}
                    disabled={timer.running}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeTab === "stopwatch" && (
          <section className="tool-grid">
            <article className="panel fullscreenable" id="widget-stopwatch">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">Stopwatch</span>
                  <h2>Elapsed</h2>
                </div>
                <WidgetTools label="stopwatch" targetId="widget-stopwatch">
                  <Flag size={22} aria-hidden="true" />
                </WidgetTools>
              </div>

              <time className="stopwatch-time">{formatStopwatch(stopwatchMs)}</time>
              <div className="button-row">
                {stopwatch.running ? (
                  <button className="primary-button" type="button" onClick={pauseStopwatch}>
                    <Pause size={18} />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button className="primary-button" type="button" onClick={startStopwatch}>
                    <Play size={18} />
                    <span>Start</span>
                  </button>
                )}
                <button className="secondary-button" type="button" onClick={addLap}>
                  <Flag size={18} />
                  <span>Lap</span>
                </button>
                <button className="secondary-button" type="button" onClick={resetStopwatch}>
                  <RotateCcw size={18} />
                  <span>Reset</span>
                </button>
              </div>
            </article>

            <article className="panel wide fullscreenable" id="widget-stopwatch-laps">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">{stopwatch.laps.length} marks</span>
                  <h2>Laps</h2>
                </div>
                <WidgetTools label="stopwatch laps" targetId="widget-stopwatch-laps">
                  <Clock3 size={22} aria-hidden="true" />
                </WidgetTools>
              </div>
              <div className="list">
                {stopwatch.laps.length === 0 && <p className="empty">No laps recorded.</p>}
                {stopwatch.laps.map((lap, index) => {
                  const previousLap = stopwatch.laps[index + 1] ?? 0;

                  return (
                    <div className="list-item" key={`${lap}-${index}`}>
                      <span className="status-pill">Lap {stopwatch.laps.length - index}</span>
                      <div className="list-primary">
                        <strong>{formatStopwatch(lap)}</strong>
                        <span>Split {formatStopwatch(lap - previousLap)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        )}

        {activeTab === "world" && (
          <section className="tool-grid">
            <article className="panel fullscreenable" id="widget-add-city">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">World</span>
                  <h2>Add City</h2>
                </div>
                <WidgetTools label="add city" targetId="widget-add-city">
                  <Globe2 size={22} aria-hidden="true" />
                </WidgetTools>
              </div>
              <div className="stack-form">
                <label className="field">
                  <span>City search</span>
                  <div className="typeahead-field">
                    <Search size={17} aria-hidden="true" />
                    <input
                      list="city-options"
                      placeholder="Search city, country, continent"
                      value={cityQuery}
                      onChange={(event) => setCityQuery(event.target.value)}
                    />
                  </div>
                  <datalist id="city-options">
                    {cityOptions.map((city) => (
                      <option key={city.id} value={formatCityOption(city)} />
                    ))}
                  </datalist>
                </label>
                <div className="city-suggestions" aria-label="City suggestions">
                  {cityMatches.map((city) => (
                    <button
                      className="city-chip"
                      key={city.id}
                      type="button"
                      onClick={() => addWorldClock(city)}
                    >
                      <strong>{city.label}</strong>
                      <span>
                        {city.country} - {city.continent}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => addWorldClock()}
                >
                  <Plus size={18} />
                  <span>{selectedCity ? `Add ${selectedCity.label}` : "Add city"}</span>
                </button>
              </div>
            </article>

            <article className="panel wide fullscreenable" id="widget-world-clocks">
              <div className="panel-heading">
                <div>
                  <span className="section-kicker">{worldClocks.length} cities</span>
                  <h2>World Clocks</h2>
                </div>
                <WidgetTools label="world clocks" targetId="widget-world-clocks">
                  <Globe2 size={22} aria-hidden="true" />
                </WidgetTools>
              </div>
              <div className="clock-grid">
                {worldClocks.map((clock) => (
                  <div className="world-card" key={clock.id}>
                    <div>
                      <strong>{clock.label}</strong>
                      <span>{getTimeZoneOffsetLabel(clock.timeZone, now)}</span>
                    </div>
                    <time>
                      {formatClockTime(
                        now,
                        preferences.format,
                        preferences.showSeconds,
                        clock.timeZone
                      )}
                    </time>
                    <small>{formatDate(now, clock.timeZone)}</small>
                    <small>
                      {clock.country ?? "Saved city"} - {clock.continent ?? clock.timeZone}
                    </small>
                    <button
                      className="icon-button danger"
                      type="button"
                      aria-label={`Remove ${clock.label}`}
                      title="Remove"
                      onClick={() => removeWorldClock(clock.id)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        <AdUnit placement="inline" title="In-page ad" />
      </main>

      <div
        className={settingsOpen ? "settings-backdrop open" : "settings-backdrop"}
        onClick={() => setSettingsOpen(false)}
      />
      <aside
        className={settingsOpen ? "settings-drawer open" : "settings-drawer"}
        aria-hidden={!settingsOpen}
        aria-label="Settings"
      >
        <div className="settings-header">
          <div>
            <span className="section-kicker">Preferences</span>
            <h2>Settings</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            aria-label="Close settings"
            title="Close settings"
            onClick={() => setSettingsOpen(false)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <h3>Display</h3>
          </div>
          <label className="field">
            <span>Font</span>
            <select
              value={currentFontId}
              onChange={(event) => selectFont(event.target.value as FontId)}
            >
              {fontOptions.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </label>
          <p className="settings-hint">
            {fontOptions.find((font) => font.id === currentFontId)?.description}
          </p>

          <label className="field">
            <span>Theme</span>
            <select
              value={currentThemeId}
              onChange={(event) => selectTheme(event.target.value as ThemeId)}
            >
              {themePresets.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.label} - {theme.ageGroup}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Time format</span>
            <select
              value={preferences.format}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  format: event.target.value as Preferences["format"],
                }))
              }
            >
              <option value="12">12-hour</option>
              <option value="24">24-hour</option>
            </select>
          </label>

          <label className="field checkbox-field">
            <input
              type="checkbox"
              checked={preferences.showSeconds}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  showSeconds: event.target.checked,
                }))
              }
            />
            <span>Show seconds</span>
          </label>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">
            <Volume2 size={18} aria-hidden="true" />
            <h3>Alerts</h3>
          </div>
          <label className="field">
            <span>Tone</span>
            <select
              value={preferences.tone}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  tone: event.target.value as Preferences["tone"],
                }))
              }
            >
              <option value="classic">Classic</option>
              <option value="chime">Chime</option>
              <option value="pulse">Pulse</option>
            </select>
          </label>
          <button className="secondary-button" type="button" onClick={requestNotifications}>
            <Bell size={17} aria-hidden="true" />
            <span>
              {notificationState === "granted"
                ? "Notifications on"
                : "Enable notifications"}
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
}

function WidgetTools({
  children,
  label,
  targetId,
}: {
  children: ReactNode;
  label: string;
  targetId: string;
}) {
  return (
    <div className="panel-tools">
      <FullscreenButton label={label} targetId={targetId} />
      {children}
    </div>
  );
}

function FullscreenButton({ label, targetId }: { label: string; targetId: string }) {
  return (
    <button
      className="icon-button fullscreen-button"
      type="button"
      aria-label={`Open ${label} full screen`}
      title="Full screen"
      onClick={() => toggleFullscreen(targetId)}
    >
      <Maximize2 size={17} aria-hidden="true" />
    </button>
  );
}

function AdUnit({ placement, title }: { placement: AdPlacement; title: string }) {
  const slot = adSlots[placement];
  const isConfigured = Boolean(adsenseClientId && slot);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle ?? [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense can reject duplicate pushes during hot reloads in development.
    }
  }, [isConfigured, placement]);

  return (
    <aside
      className={isConfigured ? `ad-unit ${placement}` : `ad-unit ${placement} empty`}
      aria-label={`${title} advertisement`}
    >
      <div className="ad-label">
        <BadgeDollarSign size={16} aria-hidden="true" />
        <span>Advertisement</span>
      </div>
      {isConfigured ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseClientId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="ad-placeholder">
          <strong>{title}</strong>
          <span>Configure AdSense env vars to serve live ads here.</span>
        </div>
      )}
    </aside>
  );
}

function useAdsenseScript(clientId: string) {
  useEffect(() => {
    if (!clientId) {
      return;
    }

    const scriptId = "google-adsense-script";

    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      clientId
    )}`;
    document.head.appendChild(script);
  }, [clientId]);
}

function normalizeTheme(theme: unknown): ThemeId {
  if (theme === "dark") {
    return "midnight";
  }

  if (theme === "light") {
    return "classic";
  }

  return themePresets.some((preset) => preset.id === theme)
    ? (theme as ThemeId)
    : "classic";
}

function normalizeFont(font: unknown): FontId {
  return fontOptions.some((option) => option.id === font) ? (font as FontId) : "system";
}

function toggleFullscreen(targetId: string) {
  const element = document.getElementById(targetId);

  if (!element) {
    return;
  }

  if (document.fullscreenElement === element || element.classList.contains("pseudo-fullscreen")) {
    disablePseudoFullscreen(element);

    if (document.fullscreenElement === element) {
      void document.exitFullscreen();
    }

    return;
  }

  if (document.fullscreenElement) {
    void document.exitFullscreen().then(() => enableFullscreen(element));
    return;
  }

  enableFullscreen(element);
}

function enableFullscreen(element: HTMLElement) {
  enablePseudoFullscreen(element);

  if (!element.requestFullscreen) {
    return;
  }

  void element.requestFullscreen().catch(() => undefined);
}

function enablePseudoFullscreen(element: HTMLElement) {
  element.classList.add("pseudo-fullscreen");
  document.body.classList.add("fullscreen-lock");
  document.addEventListener("keydown", handlePseudoFullscreenKeydown);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
}

function disablePseudoFullscreen(element: Element) {
  element.classList.remove("pseudo-fullscreen");

  if (!document.querySelector(".pseudo-fullscreen")) {
    document.body.classList.remove("fullscreen-lock");
    document.removeEventListener("keydown", handlePseudoFullscreenKeydown);
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }
}

function handlePseudoFullscreenKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape") {
    return;
  }

  document.querySelectorAll(".pseudo-fullscreen").forEach(disablePseudoFullscreen);
}

function handleFullscreenChange() {
  if (document.fullscreenElement) {
    return;
  }

  document.querySelectorAll(".pseudo-fullscreen").forEach(disablePseudoFullscreen);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
}

function getCityMatches(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return defaultCitySuggestionIds
      .map((id) => cityOptions.find((city) => city.id === id))
      .filter((city): city is WorldClockItem => Boolean(city));
  }

  return cityOptions
    .filter((city) => citySearchText(city).includes(normalizedQuery))
    .slice(0, 10);
}

function findCityFromQuery(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return undefined;
  }

  return (
    cityOptions.find((city) => formatCityOption(city).toLowerCase() === normalizedQuery) ??
    cityOptions.find((city) => city.label.toLowerCase() === normalizedQuery) ??
    cityOptions.find((city) => citySearchText(city).startsWith(normalizedQuery)) ??
    cityOptions.find((city) => citySearchText(city).includes(normalizedQuery))
  );
}

function formatCityOption(city: WorldClockItem) {
  return `${city.label}, ${city.country} - ${city.continent}`;
}

function citySearchText(city: WorldClockItem) {
  return `${city.label} ${city.country} ${city.continent} ${city.timeZone}`.toLowerCase();
}

function nextHourValue() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  return timeValue(date);
}

function hourDegrees(date: Date) {
  return (date.getHours() % 12) * 30 + date.getMinutes() * 0.5;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default App;
