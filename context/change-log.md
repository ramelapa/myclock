# Change Log

## 2026-05-16

- Added fullscreen controls to the main clock and all primary clock tool widgets.
- Added a settings side drawer with font, theme, time format, seconds, tone, and notification controls.
- Added persisted font preferences with System, Serif, Rounded, Mono, and Readable options.
- Expanded world clock cities across all continents and popular countries.
- Replaced the world city dropdown with typeahead search and quick city suggestion buttons.
- Updated context and README documentation for fullscreen, settings, fonts, and city search.

- Removed the AI tab, AI suggestion state, AI helper module, and AI feature references.
- Added six mood/audience themes and a theme studio UI.
- Added AdSense-ready top, inline, and rail ad placements.
- Added `.env.example` with AdSense configuration keys.
- Updated app metadata and README to match the current product direction.
- Added this `context/` folder for future development continuity.

## Initial Build

- Created a Vite + React + TypeScript frontend app in `/Users/ram/Documents/myclock`.
- Added live digital and analog clock display.
- Added alarms with labels, repeat, snooze, sounds, and notifications.
- Added countdown timer with custom duration, presets, progress ring, and alerts.
- Added stopwatch with lap and split tracking.
- Added world clocks using browser Intl timezone formatting.
- Added local persistence via `localStorage`.
- Added responsive layout and static production build support.
