# MyClock Project Context

Last updated: 2026-05-16

## Product Direction

MyClock is a public-facing browser clock utility inspired by online clock sites such as vClock. The current goal is a fast, static, ad-ready frontend that works without accounts, downloads, or a backend.

The app should prioritize useful clock workflows over marketing pages. The first screen should remain the working product.

## Current Stack

- Vite
- React
- TypeScript
- Lucide React
- Browser APIs: `localStorage`, Web Audio, Notifications, Intl date/time formatting

## Current Feature Set

- Live digital clock with optional seconds
- Analog clock face
- 12-hour and 24-hour display modes
- Fullscreen control on primary widgets and tool panels
- Settings side drawer for display and alert preferences
- Font preferences:
  - System
  - Serif
  - Rounded
  - Mono
  - Readable
- Multiple saved alarms with labels
- Alarm enable/disable, daily repeat, one-time snooze, alert sounds, and browser notifications
- Countdown timer with custom hours/minutes/seconds, presets, progress ring, pause, resume, and reset
- Stopwatch with start, pause, reset, lap, and split tracking
- World clocks for cities across Africa, Asia, Europe, North America, South America, Oceania, and Antarctica
- Typeahead city search by city, country, continent, or time zone
- Mood and age-group themes:
  - Classic: clear, everyone
  - Midnight: focused, adults
  - Sunrise: calm, adults
  - Playful: bright, kids
  - Neon: energetic, teens
  - High Contrast: readable, seniors
- AdSense-ready ad inventory:
  - top banner
  - in-page placement
  - sidebar/rail placement
- Local persistence for user preferences and clocks

## Removed For Now

- AI time assistant and all related prompt/suggestion code were removed at the user's request.
- The app should not advertise AI features until that direction is reintroduced.

## AdSense Notes

Ad serving is configurable through Vite env vars:

```bash
VITE_ADSENSE_CLIENT_ID=ca-pub-your-publisher-id
VITE_ADSENSE_SLOT_TOP=your-top-slot
VITE_ADSENSE_SLOT_INLINE=your-inline-slot
VITE_ADSENSE_SLOT_RAIL=your-rail-slot
```

If these values are missing, the app renders non-serving ad placeholders. This keeps local development and static builds stable before AdSense approval.

## Implementation Notes

- `src/App.tsx` holds the main UI and state transitions.
- `src/styles.css` holds all theme tokens and responsive layout.
- `src/types.ts` owns the shared app types.
- `src/lib/time.ts` contains time formatting and city/time-zone options.
- `src/lib/alerts.ts` contains Web Audio and Notification helpers.
- `src/hooks/useLocalStorage.ts` persists preferences and user-created clock data.

## Verification Commands

```bash
npm run build
npm run lint
```
